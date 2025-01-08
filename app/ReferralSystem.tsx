"use client";

import { useState, useEffect } from "react";

interface ReferralSystemProps {
  userId: string;
}

const ReferralSystem = ({ userId }: ReferralSystemProps) => {
  const [invitedFriends, setInvitedFriends] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // تحميل الأصدقاء المدعوين من localStorage
    const storedInvitedFriends = localStorage.getItem("invitedFriends");
    if (storedInvitedFriends) {
      setInvitedFriends(JSON.parse(storedInvitedFriends));
    }
  }, []);

  const copyReferralLink = () => {
    const referralLink = `https://t.me/monton_bot?start=ref${userId}`;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ marginBottom: "15px", padding: "12px", backgroundColor: "#555", borderRadius: "6px" }}>
      <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "10px" }}>Invited Friends</h2>
      <button
        onClick={copyReferralLink}
        style={{ marginBottom: "10px", padding: "8px 16px", backgroundColor: "#FFA500", color: "white", borderRadius: "4px" }}
      >
        Copy Referral Link
      </button>
      {copied && <div style={{ color: "lime", marginTop: "5px" }}>Copied</div>}
      <ul>
        {invitedFriends.map((friend, index) => (
          <li key={index} style={{ marginBottom: "5px" }}>
            {friend}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReferralSystem;
