import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://tghjsquavgavtymsyknb.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnaGpzcXVhdmdhdnR5bXN5a25iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI5OTM5MTEsImV4cCI6MjA4ODU2OTkxMX0.7y5zxa3LJam6utP5OLjEdTYTQ5RjJ6lRRQWkm1aWO5g"
);

// IndeedからのApplication webhookを受け取り、job_seekersに自動登録するエンドポイント
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = req.body || {};

    // Indeed Apply のデータ形式に対応（複数フォーマット）
    const firstName = body.applicant?.firstName || body.firstName || "";
    const lastName = body.applicant?.lastName || body.lastName || "";
    const fullName = `${firstName} ${lastName}`.trim() || body.name || "名前不明";
    const email = body.applicant?.email || body.email || "";
    const phone = body.applicant?.phoneNumber || body.phone || "";
    const coverLetter = body.applicant?.coverLetter || body.coverLetter || "";
    const jobId = body.jobId || body.referencenumber || "";
    const jobTitle = body.jobTitle || body.positionTitle || "";

    const notes = [
      `Indeed応募日: ${new Date().toLocaleDateString("ja-JP")}`,
      jobTitle && `応募求人: ${jobTitle}`,
      jobId && `求人ID: ${jobId}`,
    ].filter(Boolean).join(" / ");

    const seeker = {
      name: fullName,
      email,
      phone,
      source: "Indeed",
      status: "Indeed応募",
      self_pr: coverLetter,
      notes,
    };

    const { error: insertError } = await supabase
      .from("job_seekers")
      .insert(seeker);

    if (insertError) throw insertError;

    // 対応する求人の応募数をインクリメント
    if (jobId) {
      const { data: job } = await supabase
        .from("job_postings")
        .select("applicant_count, id")
        .eq("id", jobId)
        .single();

      if (job) {
        await supabase
          .from("job_postings")
          .update({
            applicant_count: (job.applicant_count || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq("id", jobId);
      }
    }

    res.status(200).json({ success: true, message: "Applicant registered" });
  } catch (err) {
    console.error("Indeed apply webhook error:", err);
    res.status(500).json({ error: err.message });
  }
}
