import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tghjsquavgavtymsyknb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnaGpzcXVhdmdhdnR5bXN5a25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTM5MTEsImV4cCI6MjA4ODU2OTkxMX0.7y5zxa3LJam6utP5OLjEdTYTQ5RjJ6lRRQWkm1aWO5g"
);

export default async function handler(req, res) {
  const { data: jobs, error } = await supabase
    .from("job_postings")
    .select("*")
    .eq("status", "æ²è¼ä¸­");

  if (error) {
    res.status(500).send("Error fetching jobs");
    return;
  }

  const jobsXml = (jobs || []).map(j => `  <job>
    <title><![CDATA[${j.job_title}]]></title>
    <date><![CDATA[${new Date(j.created_at).toLocaleDateString("ja-JP")}]]></date>
    <referencenumber><![CDATA[${j.id}]]></referencenumber>
    <url><![CDATA[https://takahiro-crm.vercel.app/api/jobs-feed]]></url>
    <company><![CDATA[${j.company_name}]]></company>
    <city><![CDATA[${j.location || ""}]]></city>
    <country>JP</country>
    <description><![CDATA[${[
      j.job_description || "",
      j.required_skills ? "\n\nãæ±ãã£¤ºæ®æã\n" + j.required_skills : "",
      j.benefits ? "\n\nãç¦å©åçã\n" + j.benefits : "",
      j.work_hours ? "\n\nãå¤åæéã\n" + j.work_hours : "",
    ].join("")}]]></description>
    ${j.salary_min ? `<salary><![CDATA[æçµ¦ ${j.salary_min.toLocaleString()}å${j.salary_max ? "ã" + j.salary_max.toLocaleString() + "å" : "ã"}]]></salary>` : ""}
    <jobtype><![CDATA[${j.employment_type || "æ­£ç¤¾å¡"}]]></jobtype>
  </job>`).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<source>
  <publisher>ã­ã¡ã­ã³ã¹ã¡äººæç´¹ä»</publisher>
  <publisherurl>https://takahiro-crm.vercel.app</publisherurl>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${jobsXml}
</source>`;

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=300");
  res.status(200).send(xml);
}
