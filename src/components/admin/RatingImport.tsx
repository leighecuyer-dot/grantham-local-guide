import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, Link, CheckCircle2, AlertCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Business } from "@/types/business";
import * as XLSX from "xlsx";

interface RatingImportProps {
  businesses: Business[];
  onComplete: () => void;
}

interface RatingRow {
  name: string;
  google_rating?: number;
  google_reviews_url?: string;
  tripadvisor_rating?: number;
  tripadvisor_url?: string;
}

interface MatchResult {
  rowName: string;
  matchedBusiness: Business | null;
  googleRating?: number;
  googleReviewsUrl?: string;
  tripadvisorRating?: number;
  tripadvisorUrl?: string;
  similarity: number;
}

// Column name mappings
const COLUMN_MAPPINGS: Record<string, string> = {
  "business_name": "name",
  "business name": "name",
  "businessname": "name",
  "name": "name",
  "google_rating": "google_rating",
  "google rating": "google_rating",
  "googlerating": "google_rating",
  "google_review": "google_rating",
  "google review": "google_rating",
  "google_score": "google_rating",
  "google score": "google_rating",
  "google_review_score": "google_rating",
  "google review score": "google_rating",
  "google_reviews_url": "google_reviews_url",
  "google reviews url": "google_reviews_url",
  "google_url": "google_reviews_url",
  "google url": "google_reviews_url",
  "google_maps_url": "google_reviews_url",
  "google maps url": "google_reviews_url",
  "google_maps_link": "google_reviews_url",
  "google maps link": "google_reviews_url",
  "tripadvisor_rating": "tripadvisor_rating",
  "tripadvisor rating": "tripadvisor_rating",
  "tripadvisorrating": "tripadvisor_rating",
  "tripadvisor_score": "tripadvisor_rating",
  "tripadvisor score": "tripadvisor_rating",
  "trip_advisor_rating": "tripadvisor_rating",
  "trip advisor rating": "tripadvisor_rating",
  "tripadvisor_url": "tripadvisor_url",
  "tripadvisor url": "tripadvisor_url",
  "tripadvisorurl": "tripadvisor_url",
  "trip_advisor_url": "tripadvisor_url",
  "trip advisor url": "tripadvisor_url",
};

const normalizeHeader = (header: string): string => {
  const normalized = header.toLowerCase().trim().replace(/\s+/g, "_");
  return COLUMN_MAPPINGS[normalized] || COLUMN_MAPPINGS[header.toLowerCase().trim()] || normalized;
};

// Fuzzy string matching using Levenshtein distance
const levenshteinDistance = (a: string, b: string): number => {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[b.length][a.length];
};

const calculateSimilarity = (a: string, b: string): number => {
  const normalizedA = a.toLowerCase().trim();
  const normalizedB = b.toLowerCase().trim();
  
  if (normalizedA === normalizedB) return 1;
  
  const maxLen = Math.max(normalizedA.length, normalizedB.length);
  if (maxLen === 0) return 1;
  
  const distance = levenshteinDistance(normalizedA, normalizedB);
  return 1 - distance / maxLen;
};

const findBestMatch = (name: string, businesses: Business[]): { business: Business | null; similarity: number } => {
  let bestMatch: Business | null = null;
  let bestSimilarity = 0;
  
  const searchName = name.toLowerCase().trim();
  
  for (const business of businesses) {
    const businessName = business.name.toLowerCase().trim();
    
    // Exact match
    if (businessName === searchName) {
      return { business, similarity: 1 };
    }
    
    // Contains match
    if (businessName.includes(searchName) || searchName.includes(businessName)) {
      const similarity = 0.9;
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity;
        bestMatch = business;
      }
      continue;
    }
    
    // Fuzzy match
    const similarity = calculateSimilarity(searchName, businessName);
    if (similarity > bestSimilarity && similarity >= 0.7) {
      bestSimilarity = similarity;
      bestMatch = business;
    }
  }
  
  return { business: bestMatch, similarity: bestSimilarity };
};

const parseRating = (value: any): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = parseFloat(String(value));
  if (isNaN(parsed) || parsed < 0 || parsed > 5) return undefined;
  return Math.round(parsed * 10) / 10; // Round to 1 decimal
};

export const RatingImport = ({ businesses, onComplete }: RatingImportProps) => {
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [pasteData, setPasteData] = useState("");
  const [sheetsUrl, setSheetsUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processData = (data: any[][]) => {
    if (data.length < 2) {
      toast.error("File must have at least a header row and one data row");
      return;
    }

    const headers = data[0].map((h: any) => normalizeHeader(String(h)));
    const nameIndex = headers.indexOf("name");
    
    if (nameIndex === -1) {
      toast.error("Could not find a 'name' or 'business name' column");
      return;
    }

    const rows: RatingRow[] = data.slice(1)
      .filter(row => row[nameIndex]?.toString().trim())
      .map((row) => {
        const obj: any = {};
        headers.forEach((header: string, i: number) => {
          obj[header] = row[i];
        });
        return {
          name: String(obj.name || "").trim(),
          google_rating: parseRating(obj.google_rating),
          google_reviews_url: obj.google_reviews_url?.toString().trim() || undefined,
          tripadvisor_rating: parseRating(obj.tripadvisor_rating),
          tripadvisor_url: obj.tripadvisor_url?.toString().trim() || undefined,
        };
      });

    // Match rows to businesses
    const results: MatchResult[] = rows.map((row) => {
      const { business, similarity } = findBestMatch(row.name, businesses);
      return {
        rowName: row.name,
        matchedBusiness: business,
        googleRating: row.google_rating,
        googleReviewsUrl: row.google_reviews_url,
        tripadvisorRating: row.tripadvisor_rating,
        tripadvisorUrl: row.tripadvisor_url,
        similarity,
      };
    });

    setMatches(results);
    
    const matchedCount = results.filter(r => r.matchedBusiness).length;
    const hasRatings = results.filter(r => r.googleRating || r.tripadvisorRating).length;
    toast.success(`Found ${matchedCount} matches out of ${results.length} rows (${hasRatings} with ratings)`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setMatches([]);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
      processData(data);
    } catch (error: any) {
      toast.error(`Failed to parse file: ${error.message}`);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handlePaste = () => {
    if (!pasteData.trim()) {
      toast.error("Please paste some data first");
      return;
    }

    setLoading(true);
    setMatches([]);

    try {
      const lines = pasteData.trim().split("\n");
      const data = lines.map((line) => line.split("\t"));
      processData(data);
    } catch (error: any) {
      toast.error(`Failed to parse pasted data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSheetsUrl = async () => {
    if (!sheetsUrl.trim()) {
      toast.error("Please enter a Google Sheets URL");
      return;
    }

    const match = sheetsUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      toast.error("Invalid Google Sheets URL");
      return;
    }

    const sheetId = match[1];
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

    setLoading(true);
    setMatches([]);

    try {
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch sheet. Make sure it's publicly accessible.");
      }
      
      const csvText = await response.text();
      const workbook = XLSX.read(csvText, { type: "string" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
      processData(data);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    const toUpdate = matches.filter(
      m => m.matchedBusiness && (m.googleRating || m.googleReviewsUrl || m.tripadvisorRating || m.tripadvisorUrl)
    );

    if (toUpdate.length === 0) {
      toast.error("No valid matches with ratings to import");
      return;
    }

    setImporting(true);
    let successCount = 0;
    let errorCount = 0;

    for (const match of toUpdate) {
      if (!match.matchedBusiness) continue;

      const updates: any = {};
      if (match.googleRating !== undefined) updates.google_rating = match.googleRating;
      if (match.googleReviewsUrl) updates.google_reviews_url = match.googleReviewsUrl;
      if (match.tripadvisorRating !== undefined) updates.tripadvisor_rating = match.tripadvisorRating;
      if (match.tripadvisorUrl) updates.tripadvisor_url = match.tripadvisorUrl;

      const { error } = await supabase
        .from("businesses")
        .update(updates)
        .eq("id", match.matchedBusiness.id);

      if (error) {
        console.error(`Failed to update ${match.matchedBusiness.name}:`, error);
        errorCount++;
      } else {
        successCount++;
      }
    }

    setImporting(false);
    
    if (successCount > 0) {
      toast.success(`Updated ratings for ${successCount} businesses`);
      onComplete();
    }
    if (errorCount > 0) {
      toast.error(`Failed to update ${errorCount} businesses`);
    }
    
    setMatches([]);
    setPasteData("");
    setSheetsUrl("");
  };

  const matchedCount = matches.filter(m => m.matchedBusiness).length;
  const unmatchedCount = matches.filter(m => !m.matchedBusiness).length;
  const withRatings = matches.filter(m => m.matchedBusiness && (m.googleRating || m.tripadvisorRating)).length;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Star className="w-5 h-5 text-[#FBBC05]" />
          Bulk Import Ratings
        </h3>
        <p className="text-sm text-muted-foreground">
          Upload a spreadsheet with business names and their Google/TripAdvisor ratings. 
          The system will match names to existing businesses and update their ratings.
        </p>
        <p className="text-xs text-muted-foreground">
          Required column: <code className="bg-muted px-1 rounded">name</code> or <code className="bg-muted px-1 rounded">business_name</code><br/>
          Optional columns: <code className="bg-muted px-1 rounded">google_rating</code>, <code className="bg-muted px-1 rounded">google_reviews_url</code>, <code className="bg-muted px-1 rounded">tripadvisor_rating</code>, <code className="bg-muted px-1 rounded">tripadvisor_url</code>
        </p>
      </div>

      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="file" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            File
          </TabsTrigger>
          <TabsTrigger value="sheets" className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            Google Sheets
          </TabsTrigger>
          <TabsTrigger value="paste" className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            Paste
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="space-y-4">
          <div>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              disabled={loading}
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Supports CSV, XLSX, and XLS files
            </p>
          </div>
        </TabsContent>

        <TabsContent value="sheets" className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Paste Google Sheets URL..."
              value={sheetsUrl}
              onChange={(e) => setSheetsUrl(e.target.value)}
              disabled={loading}
            />
            <Button onClick={handleGoogleSheetsUrl} disabled={loading || !sheetsUrl}>
              {loading ? "Loading..." : "Fetch"}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Sheet must be publicly accessible (Anyone with link can view)
          </p>
        </TabsContent>

        <TabsContent value="paste" className="space-y-4">
          <Textarea
            placeholder="Paste data from spreadsheet (tab-separated)..."
            value={pasteData}
            onChange={(e) => setPasteData(e.target.value)}
            rows={6}
            disabled={loading}
          />
          <Button onClick={handlePaste} disabled={loading || !pasteData}>
            {loading ? "Parsing..." : "Parse Data"}
          </Button>
        </TabsContent>
      </Tabs>

      {matches.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                {matchedCount} matched
              </span>
              <span className="flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                {unmatchedCount} unmatched
              </span>
              <span className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-[#FBBC05]" />
                {withRatings} with ratings
              </span>
            </div>
            <Button 
              onClick={handleImport} 
              disabled={importing || withRatings === 0}
            >
              {importing ? "Updating..." : `Update ${withRatings} Businesses`}
            </Button>
          </div>

          <div className="max-h-80 overflow-y-auto border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-muted sticky top-0">
                <tr>
                  <th className="text-left p-2 font-medium">Spreadsheet Name</th>
                  <th className="text-left p-2 font-medium">Matched To</th>
                  <th className="text-center p-2 font-medium">Google</th>
                  <th className="text-center p-2 font-medium">TripAdvisor</th>
                  <th className="text-center p-2 font-medium">Match</th>
                </tr>
              </thead>
              <tbody>
                {matches.map((match, i) => (
                  <tr key={i} className={`border-t ${!match.matchedBusiness ? "bg-amber-500/5" : ""}`}>
                    <td className="p-2 truncate max-w-[200px]" title={match.rowName}>
                      {match.rowName}
                    </td>
                    <td className="p-2 truncate max-w-[200px]" title={match.matchedBusiness?.name}>
                      {match.matchedBusiness ? (
                        <span className="text-green-600">{match.matchedBusiness.name}</span>
                      ) : (
                        <span className="text-muted-foreground italic">No match</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {match.googleRating ? (
                        <span className="font-medium">{match.googleRating.toFixed(1)}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {match.tripadvisorRating ? (
                        <span className="font-medium">{match.tripadvisorRating.toFixed(1)}</span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                    <td className="p-2 text-center">
                      {match.matchedBusiness ? (
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          match.similarity >= 0.95 ? "bg-green-500/10 text-green-600" :
                          match.similarity >= 0.8 ? "bg-amber-500/10 text-amber-600" :
                          "bg-red-500/10 text-red-600"
                        }`}>
                          {Math.round(match.similarity * 100)}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
