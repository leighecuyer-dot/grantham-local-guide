import { createClient } from "https://esm.sh/@supabase/supabase-js@2.87.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { businessId, websiteUrl } = await req.json();

    if (!businessId || !websiteUrl) {
      return new Response(
        JSON.stringify({ success: false, error: "businessId and websiteUrl are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const firecrawlApiKey = Deno.env.get("FIRECRAWL_API_KEY");
    if (!firecrawlApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: "Firecrawl not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Format URL
    let formattedUrl = websiteUrl.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    console.log(`Scraping ${formattedUrl} for business ${businessId}`);

    // Use Firecrawl to scrape the website for branding/images
    const scrapeResponse = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${firecrawlApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: formattedUrl,
        formats: ["screenshot", "links"],
        onlyMainContent: false,
        waitFor: 2000,
      }),
    });

    const scrapeData = await scrapeResponse.json();

    if (!scrapeResponse.ok) {
      console.error("Firecrawl error:", scrapeData);
      return new Response(
        JSON.stringify({ success: false, error: scrapeData.error || "Failed to scrape website" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get screenshot from response - can be a URL or base64
    const screenshot = scrapeData.data?.screenshot || scrapeData.screenshot;

    if (!screenshot) {
      return new Response(
        JSON.stringify({ success: false, error: "No screenshot captured" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let binaryData: Uint8Array;

    // Check if screenshot is a URL or base64 data
    if (screenshot.startsWith("http://") || screenshot.startsWith("https://")) {
      // Fetch the image from URL
      console.log("Fetching screenshot from URL:", screenshot);
      const imageResponse = await fetch(screenshot);
      if (!imageResponse.ok) {
        return new Response(
          JSON.stringify({ success: false, error: "Failed to fetch screenshot image" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const arrayBuffer = await imageResponse.arrayBuffer();
      binaryData = new Uint8Array(arrayBuffer);
    } else {
      // Convert base64 to binary
      console.log("Decoding base64 screenshot");
      const base64Data = screenshot.replace(/^data:image\/\w+;base64,/, "");
      binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
    }

    // Upload to Supabase storage
    const fileName = `${businessId}.png`;
    const { error: uploadError } = await supabase.storage
      .from("business-images")
      .upload(fileName, binaryData, {
        contentType: "image/png",
        upsert: true,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(
        JSON.stringify({ success: false, error: uploadError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("business-images")
      .getPublicUrl(fileName);

    const imageUrl = urlData.publicUrl;

    // Update business record
    const { error: updateError } = await supabase
      .from("businesses")
      .update({ image: imageUrl })
      .eq("id", businessId);

    if (updateError) {
      console.error("Update error:", updateError);
      return new Response(
        JSON.stringify({ success: false, error: updateError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Successfully updated image for business ${businessId}`);

    return new Response(
      JSON.stringify({ success: true, imageUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
