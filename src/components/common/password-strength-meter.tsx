"use client";

import React from "react";

const RULES = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/];

export function getPasswordStrength(pw: string) {
  const ruleScore = RULES.filter((r) => r.test(pw)).length;
  const lengthScore = pw.length >= 8 ? 1 : 0;
  const score = ruleScore + lengthScore;
  const colors = ["#ef4444", "#f97316", "#eab308", "#84cc16", "#22c55e"];
  return {
    score,
    max: 5,
    color: colors[score] ?? colors[0],
    isComplex: ruleScore === 4 && pw.length >= 8,
  };
}

export function PasswordStrengthMeter({
  password,
  isFocused,
}: {
  password: string;
  isFocused: boolean;
}) {
  if (!isFocused && !password) return null;

  const { score, max, color } = getPasswordStrength(password);
  const percent = password.length === 0 ? 0 : Math.round((score / max) * 100);

  const getLabel = () => {
    if (!password) return "Enter password";
    if (score <= 1) return "Very Weak";
    if (score === 2) return "Weak";
    if (score === 3) return "Fair";
    if (score === 4) return "Good";
    return "Strong (Meets all rules)";
  };

  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex items-center justify-between text-[10px]">
        <span className="font-semibold text-slate-500">Strength:</span>
        <span className="font-bold" style={{ color }}>
          {getLabel()}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full transition-all duration-300 rounded-full"
          style={{
            width: `${percent}%`,
            backgroundColor: color,
          }}
        />
      </div>
      <p className="text-[10px] text-slate-400">
        Requires 8+ chars, 1 uppercase, 1 lowercase, 1 number, 1 special character.
      </p>
    </div>
  );
}
