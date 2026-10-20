"use client";
import { useState } from "react";
export function CopyReportLinkButton() { const [copied, setCopied] = useState(false); async function copy() { try { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1800); } catch { setCopied(false); } } return <button className="copy-button" type="button" onClick={copy}>{copied ? "Report link copied" : "Copy report link"}</button>; }
