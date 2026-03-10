import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SeekerManagement, JobPostingManagement } from "./SeekerJobManager";

// ââ Supabase ââââââââââââââââââââââââââââââââââââââââââââââââââ
const SUPABASE_URL = "https://tghjsquavgavtymsyknb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnaGpzcXVhdmdhdnR5bXN5a25iIiwicm5sZSI6ImFub24iLCJpYXQiOjE3NzI5OTM5MTEsImV4cCI6MjA4ODU2OTkxMX0.7y5zxa3LJam6utP5OLjEdTYTQ5RjJ6lRRQWkm1aWO5g";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ââ Initial Data âââââââââââââââââââââââââââââââââââââââââââââ
const INIT = {
