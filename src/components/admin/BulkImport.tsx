import { useState, useRef } from "react";
import { Upload, FileSpreadsheet, Link, ClipboardPaste, Download, AlertCircle, CheckCircle2, ChevronDown, ChevronRight, AlertTriangle, Pencil, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { CATEGORIES, Category } from "@/types/business";
import { CreateBusinessInput } from "@/hooks/useBusinesses";
import * as XLSX from "xlsx";

interface BulkImportProps {
  onImport: (businesses: CreateBusinessInput[]) => Promise<void>;
}

interface ParsedRow {
  name: string;
  category: string;
  description: string;
  address: string;
  town?: string;
  phone?: string;
  website?: string;
  instagram?: string;
  email?: string;
  image?: string;
  featured?: boolean | string;
  tripadvisor_rating?: number | string;
  tripadvisor_url?: string;
  tags?: string;
  // Extended fields for user's custom columns
  description_2?: string;
  rewritten_description?: string;
  google_rating?: number | string;
  google_maps_url?: string;
  opening_hours?: string;
}

const EXPECTED_COLUMNS = [
  "name",
  "category",
  "description",
  "address",
  "town",
  "phone",
  "website",
  "instagram",
  "email",
  "image",
  "featured",
  "tripadvisor_rating",
  "tripadvisor_url",
  "tags",
];

// Column name mappings to handle variations
const COLUMN_MAPPINGS: Record<string, string> = {
  // Name variations
  "business_name": "name",
  "business name": "name",
  "businessname": "name",
  // Category
  // Phone variations
  "phone_no": "phone",
  "phone no": "phone",
  "phoneno": "phone",
  "telephone": "phone",
  "tel": "phone",
  // Social media
  "social_media_link": "instagram",
  "social media link": "instagram",
  "socialmedialink": "instagram",
  "social": "instagram",
  // Description variations - use "rewritten_description" or combine
  "rewritten_description": "description",
  "rewritten description": "description",
  "description_1": "description",
  "description 1": "description",
  // Google review as rating
  "google_review_score": "google_rating",
  "google review score": "google_rating",
  "googlereviewscore": "google_rating",
  // Google maps link
  "google_maps_link": "google_maps_url",
  "google maps link": "google_maps_url",
  "googlemapslink": "google_maps_url",
  // Opening hours (new field we'll capture)
  "opening_hours": "opening_hours",
  "openinghours": "opening_hours",
};

const normalizeHeader = (header: string): string => {
  const normalized = header.toLowerCase().trim().replace(/\s+/g, "_");
  return COLUMN_MAPPINGS[normalized] || COLUMN_MAPPINGS[header.toLowerCase().trim()] || normalized;
};

const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const normalizeCategory = (cat: string): Category | null => {
  const normalized = cat.trim();
  const found = CATEGORIES.find(
    (c) => c.toLowerCase() === normalized.toLowerCase()
  );
  return found || null;
};

const parseBoolean = (val: any): boolean => {
  if (typeof val === "boolean") return val;
  if (typeof val === "string") {
    return ["true", "yes", "1", "y"].includes(val.toLowerCase().trim());
  }
  return !!val;
};

const parseTags = (tags: string | undefined): string[] => {
  if (!tags) return [];
  return tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
};

interface SkippedRow {
  rowNum: number;
  name: string;
  category: string;
  description: string;
  address: string;
  reason: string;
  originalData: ParsedRow;
}

const parseRows = (rows: ParsedRow[]): { valid: CreateBusinessInput[]; errors: string[]; skippedRows: SkippedRow[] } => {
  const valid: CreateBusinessInput[] = [];
  const errors: string[] = [];
  const skippedRows: SkippedRow[] = [];

  rows.forEach((row, index) => {
    const rowNum = index + 2; // +2 for header row and 1-based index
    const name = row.name?.trim() || "";
    const category = row.category?.trim() || "";
    const description = row.rewritten_description?.trim() || 
      row.description?.trim() || 
      (row as any).description_1?.trim() || "";
    const address = row.address?.trim() || "";

    // Skip rows missing required fields (name, category, description, address)
    if (!name) {
      skippedRows.push({ rowNum, name, category, description, address, reason: "Missing name", originalData: row });
      return;
    }
    if (!category) {
      skippedRows.push({ rowNum, name, category, description, address, reason: "Missing category", originalData: row });
      return;
    }
    if (!description) {
      skippedRows.push({ rowNum, name, category, description, address, reason: "Missing description", originalData: row });
      return;
    }
    if (!address) {
      skippedRows.push({ rowNum, name, category, description, address, reason: "Missing address", originalData: row });
      return;
    }

    const normalizedCategory = normalizeCategory(category);
    if (!normalizedCategory) {
      skippedRows.push({ rowNum, name, category, description, address, reason: `Invalid category "${category}"`, originalData: row });
      return;
    }

    // Use google_rating if tripadvisor_rating is not available
    const rating = row.tripadvisor_rating || row.google_rating;

    valid.push({
      name: name,
      slug: generateSlug(name),
      category: normalizedCategory,
      description: description,
      address: address,
      town: row.town?.trim() || "grantham",
      phone: row.phone?.trim() || "",
      website: row.website?.trim() || "",
      instagram: row.instagram?.trim() || "",
      email: row.email?.trim() || "",
      image: row.image?.trim() || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      featured: parseBoolean(row.featured),
      tripadvisor_rating: rating ? parseFloat(String(rating)) : undefined,
      tripadvisor_url: row.tripadvisor_url?.trim() || row.google_maps_url?.trim() || "",
      tags: parseTags(row.tags) as any,
    });
  });

  return { valid, errors, skippedRows };
};

export const BulkImport = ({ onImport }: BulkImportProps) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<CreateBusinessInput[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [skippedRows, setSkippedRows] = useState<SkippedRow[]>([]);
  const [showSkipped, setShowSkipped] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; category: string; description: string; address: string }>({ name: "", category: "", description: "", address: "" });
  const [pasteData, setPasteData] = useState("");
  const [sheetsUrl, setSheetsUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startEditing = (index: number) => {
    const row = skippedRows[index];
    setEditForm({
      name: row.name,
      category: row.category,
      description: row.description,
      address: row.address,
    });
    setEditingIndex(index);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    setEditForm({ name: "", category: "", description: "", address: "" });
  };

  const saveAndMoveToPreview = (index: number) => {
    const row = skippedRows[index];
    const { name, category, description, address } = editForm;

    // Validate
    if (!name.trim() || !category.trim() || !description.trim() || !address.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const normalizedCategory = normalizeCategory(category);
    if (!normalizedCategory) {
      toast.error(`Invalid category "${category}". Valid: ${CATEGORIES.join(", ")}`);
      return;
    }

    // Create the business entry
    const rating = row.originalData.tripadvisor_rating || row.originalData.google_rating;
    const newBusiness: CreateBusinessInput = {
      name: name.trim(),
      slug: generateSlug(name.trim()),
      category: normalizedCategory,
      description: description.trim(),
      address: address.trim(),
      town: row.originalData.town?.trim() || "grantham",
      phone: row.originalData.phone?.trim() || "",
      website: row.originalData.website?.trim() || "",
      instagram: row.originalData.instagram?.trim() || "",
      email: row.originalData.email?.trim() || "",
      image: row.originalData.image?.trim() || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      featured: parseBoolean(row.originalData.featured),
      tripadvisor_rating: rating ? parseFloat(String(rating)) : undefined,
      tripadvisor_url: row.originalData.tripadvisor_url?.trim() || row.originalData.google_maps_url?.trim() || "",
      tags: parseTags(row.originalData.tags) as any,
    };

    // Add to preview and remove from skipped
    setPreview([...preview, newBusiness]);
    setSkippedRows(skippedRows.filter((_, i) => i !== index));
    setEditingIndex(null);
    setEditForm({ name: "", category: "", description: "", address: "" });
    toast.success(`"${name}" moved to import list`);
  };

  const processSpreadsheetData = (data: any[][]) => {
    if (data.length < 2) {
      setErrors(["File must have at least a header row and one data row"]);
      return;
    }

    // Normalize headers using our mapping
    const headers = data[0].map((h: any) => normalizeHeader(String(h)));
    const rows: ParsedRow[] = data.slice(1).map((row) => {
      const obj: any = {};
      headers.forEach((header: string, i: number) => {
        obj[header] = row[i];
      });
      return obj;
    });

    const { valid, errors: parseErrors, skippedRows: skipped } = parseRows(rows);
    setErrors(parseErrors);
    setPreview(valid);
    setSkippedRows(skipped);

    if (valid.length > 0) {
      const skippedMsg = skipped.length > 0 ? ` (${skipped.length} incomplete rows skipped)` : "";
      toast.success(`Parsed ${valid.length} businesses ready to import${skippedMsg}`);
    } else if (skipped.length > 0) {
      toast.warning(`All ${skipped.length} rows were incomplete and skipped`);
    }
    if (parseErrors.length > 0) {
      toast.warning(`${parseErrors.length} rows have errors`);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setErrors([]);
    setPreview([]);
    setSkippedRows([]);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
      
      processSpreadsheetData(data);
    } catch (error: any) {
      setErrors([`Failed to parse file: ${error.message}`]);
      toast.error("Failed to parse file");
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
    setErrors([]);
    setPreview([]);
    setSkippedRows([]);

    try {
      const lines = pasteData.trim().split("\n");
      const data = lines.map((line) => line.split("\t"));
      processSpreadsheetData(data);
    } catch (error: any) {
      setErrors([`Failed to parse pasted data: ${error.message}`]);
      toast.error("Failed to parse pasted data");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSheetsUrl = async () => {
    if (!sheetsUrl.trim()) {
      toast.error("Please enter a Google Sheets URL");
      return;
    }

    // Extract sheet ID from various URL formats
    const match = sheetsUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (!match) {
      toast.error("Invalid Google Sheets URL. Make sure the sheet is publicly accessible.");
      return;
    }

    const sheetId = match[1];
    const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

    setLoading(true);
    setErrors([]);
    setPreview([]);
    setSkippedRows([]);

    try {
      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch sheet. Make sure it's publicly accessible (Anyone with link can view).");
      }
      
      const csvText = await response.text();
      const workbook = XLSX.read(csvText, { type: "string" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as any[][];
      
      processSpreadsheetData(data);
    } catch (error: any) {
      setErrors([error.message]);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (preview.length === 0) {
      toast.error("No valid businesses to import");
      return;
    }

    setLoading(true);
    try {
      await onImport(preview);
      setPreview([]);
      setSkippedRows([]);
      setPasteData("");
      setSheetsUrl("");
      toast.success(`Successfully imported ${preview.length} businesses!`);
    } catch (error: any) {
      toast.error(`Import failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([
      EXPECTED_COLUMNS,
      [
        "Example Cafe",
        "Café",
        "A lovely local café serving fresh coffee and pastries",
        "123 High Street, Grantham, NG31 1AA",
        "grantham",
        "01234 567890",
        "https://example.com",
        "https://instagram.com/example",
        "hello@example.com",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085",
        "false",
        "4.5",
        "https://tripadvisor.com/...",
        "Independent,Family-run",
      ],
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "business-import-template.xlsx");
    toast.success("Template downloaded!");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Bulk Import</h3>
          <p className="text-sm text-muted-foreground">
            Import multiple businesses from CSV, Excel, or Google Sheets
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={downloadTemplate}>
          <Download className="w-4 h-4 mr-2" />
          Download Template
        </Button>
      </div>

      <Tabs defaultValue="file" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="file" className="flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4" />
            CSV/Excel
          </TabsTrigger>
          <TabsTrigger value="sheets" className="flex items-center gap-2">
            <Link className="w-4 h-4" />
            Google Sheets
          </TabsTrigger>
          <TabsTrigger value="paste" className="flex items-center gap-2">
            <ClipboardPaste className="w-4 h-4" />
            Copy/Paste
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
            <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              Upload a CSV or Excel file (.csv, .xlsx, .xls)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Button asChild variant="secondary" disabled={loading}>
              <label htmlFor="file-upload" className="cursor-pointer">
                {loading ? "Processing..." : "Choose File"}
              </label>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="sheets" className="space-y-4">
          <div>
            <Label htmlFor="sheets-url">Google Sheets URL</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Make sure your sheet is set to "Anyone with the link can view"
            </p>
            <div className="flex gap-2">
              <Input
                id="sheets-url"
                placeholder="https://docs.google.com/spreadsheets/d/..."
                value={sheetsUrl}
                onChange={(e) => setSheetsUrl(e.target.value)}
              />
              <Button onClick={handleGoogleSheetsUrl} disabled={loading}>
                {loading ? "Loading..." : "Fetch"}
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="paste" className="space-y-4">
          <div>
            <Label htmlFor="paste-data">Paste Data</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Copy cells from your spreadsheet (including header row) and paste below
            </p>
            <Textarea
              id="paste-data"
              placeholder="name&#9;category&#9;description&#9;address&#9;..."
              value={pasteData}
              onChange={(e) => setPasteData(e.target.value)}
              rows={6}
              className="font-mono text-sm"
            />
            <Button onClick={handlePaste} disabled={loading} className="mt-2">
              {loading ? "Processing..." : "Parse Data"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {errors.length > 0 && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-destructive mb-2">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">Errors ({errors.length})</span>
          </div>
          <ul className="text-sm text-destructive/80 space-y-1 max-h-32 overflow-y-auto">
            {errors.map((err, i) => (
              <li key={i}>• {err}</li>
            ))}
          </ul>
        </div>
      )}

      {skippedRows.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <button
            onClick={() => setShowSkipped(!showSkipped)}
            className="flex items-center gap-2 text-amber-600 dark:text-amber-400 w-full text-left"
          >
            {showSkipped ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">{skippedRows.length} rows skipped (click to edit & fix)</span>
          </button>
          {showSkipped && (
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
              {skippedRows.map((row, i) => (
                <div key={i} className="bg-background rounded-md p-3 border border-border">
                  {editingIndex === i ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">Row {row.rowNum} - Editing</span>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={cancelEditing} className="h-7 px-2">
                            <X className="w-3 h-3" />
                          </Button>
                          <Button size="sm" onClick={() => saveAndMoveToPreview(i)} className="h-7 px-2">
                            <Check className="w-3 h-3 mr-1" />
                            Save & Add
                          </Button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Name *</Label>
                          <Input
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="h-8 text-sm"
                            placeholder="Business name"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Category *</Label>
                          <select
                            value={editForm.category}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className="w-full h-8 text-sm rounded-md border border-input bg-background px-2"
                          >
                            <option value="">Select category</option>
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Address *</Label>
                          <Input
                            value={editForm.address}
                            onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                            className="h-8 text-sm"
                            placeholder="Full address"
                          />
                        </div>
                        <div className="col-span-2">
                          <Label className="text-xs">Description *</Label>
                          <Textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="text-sm min-h-[60px]"
                            placeholder="Business description"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">Row {row.rowNum}</span>
                          <span className="font-medium truncate">{row.name || <span className="text-muted-foreground italic">No name</span>}</span>
                        </div>
                        <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">{row.reason}</p>
                      </div>
                      <Button size="sm" variant="outline" onClick={() => startEditing(i)} className="h-7 px-2 ml-2">
                        <Pencil className="w-3 h-3 mr-1" />
                        Fix
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {preview.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">{preview.length} businesses ready to import</span>
          </div>

          <div className="bg-muted rounded-lg overflow-hidden max-h-64 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/80 sticky top-0">
                <tr>
                  <th className="text-left px-3 py-2">Name</th>
                  <th className="text-left px-3 py-2">Category</th>
                  <th className="text-left px-3 py-2">Town</th>
                  <th className="text-left px-3 py-2">Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {preview.map((biz, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2 font-medium">{biz.name}</td>
                    <td className="px-3 py-2">{biz.category}</td>
                    <td className="px-3 py-2">{biz.town}</td>
                    <td className="px-3 py-2 truncate max-w-xs">{biz.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button onClick={handleImport} disabled={loading} className="w-full">
            {loading ? "Importing..." : `Import ${preview.length} Businesses`}
          </Button>
        </div>
      )}
    </div>
  );
};
