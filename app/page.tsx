"use client";

import WebApp from "@twa-dev/sdk";
import Image from "next/image";
import { useEffect, useState } from "react";
import paws from "..//images/paws.webp";
import ReferralSystem from "@/components/ReferralSystem";

interface UserData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code: string;
  is_premium?: boolean;
}

interface Task {
  label: string;
  url: string;
  started: boolean;
  completed: boolean;
  points: number;
}

type TaskKey = "task1" | "task2" | "task3" | "task4" | "task5" | "task6" | "task7" | "task8" | "task9";

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [tasks, setTasks] = useState<Record<TaskKey, Task>>({
    task1: { label: "Be a good mi ma moncky (+50 DOGS)", url: "https://example1.com/task1", started: false, completed: false, points: 50 },
    task2: { label: "Subscribe to DOGS channel (+100 DOGS)", url: "https://t.me/dogs_channel", started: false, completed: false, points: 100 },
    task3: { label: "Subscribe to Dogs X.com (+1000 DOGS)", url: "https://www.dogsx.com", started: false, completed: false, points: 1000 },
    task4: { label: "Invite 5 friends to DOGS (+20000 DOGS)", url: "https://example.com/task4", started: false, completed: false, points: 20000 },
    task5: { label: "Send 🦴 to Binance X.com (+100 DOGS)", url: "https://www.binance.com", started: false, completed: false, points: 100 },
    task6: { label: "Send 🦴 to OKX X.com (+100 DOGS)", url: "https://www.okx.com", started: false, completed: false, points: 100 },
    task7: { label: "Send 🦴 to Bybit X.com (+100 DOGS)", url: "https://www.bybit.com", started: false, completed: false, points: 100 },
    task8: { label: "moy", url: "https://www.okx.com", started: false, completed: false, points: 50 },
    task9: { label: "ggood", url: "https://www.bybit.com", started: false, completed: false, points: 50 },
  });
  const [points, setPoints] = useState(0);
  const [showTasks, setShowTasks] = useState(false);
  const [invitedFriends, setInvitedFriends] = useState<string[]>([]);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    const storedTasks = localStorage.getItem("tasks");
    const storedPoints = localStorage.getItem("points");
    const storedInvitedFriends = localStorage.getItem("invitedFriends");

    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
    if (storedPoints) {
      setPoints(Number(storedPoints));
    }
    if (storedInvitedFriends) {
      setInvitedFriends(JSON.parse(storedInvitedFriends));
    }

    if (WebApp.initDataUnsafe?.user) {
      const user = WebApp.initDataUnsafe.user as UserData;
      setUserData(user);
      localStorage.setItem("userData", JSON.stringify(user));

      // تحقق من وجود رابط إحالة
      const urlParams = new URLSearchParams(window.location.search);
      const referrerId = urlParams.get("ref");
      if (referrerId) {
        handleReferral(referrerId);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("points", points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem("invitedFriends", JSON.stringify(invitedFriends));
  }, [invitedFriends]);

  const handleReferral = (referrerId: string) => {
    const referredUsers = JSON.parse(localStorage.getItem("referredUsers") || "{}");

    if (!referredUsers[referrerId]?.includes(userData!.id)) {
      if (!referredUsers[referrerId]) referredUsers[referrerId] = [];
      referredUsers[referrerId].push(userData!.id);
      localStorage.setItem("referredUsers", JSON.stringify(referredUsers));

      const referrerPoints = parseInt(localStorage.getItem(`${referrerId}_points`) || "0", 10);
      localStorage.setItem(`${referrerId}_points`, (referrerPoints + 10).toString());

      // إضافة اسم المستخدم المدعو إلى قائمة الأصدقاء
      setInvitedFriends((prev) => [...prev, userData!.username || `User ${userData!.id}`]);
    }
  };

  const handleTaskStart = (taskKey: TaskKey) => {
    setTasks((prevTasks) => {
      const updatedTasks = { ...prevTasks };
      updatedTasks[taskKey].started = true;
      return updatedTasks;
    });

    const taskUrl = tasks[taskKey].url;
    if (taskUrl) {
      window.open(taskUrl, "_blank");
    }
  };

  const handleTaskComplete = (taskKey: TaskKey) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [taskKey]: { ...prevTasks[taskKey], completed: true },
    }));
    setPoints((prevPoints) => prevPoints + tasks[taskKey].points);
  };

  const activeTasks = Object.entries(tasks).filter(([_, task]) => !task.completed);

  return (
    <main style={{ padding: "20px", backgroundColor: "#1f1f1f", color: "#fff", fontFamily: "Arial, sans-serif", minHeight: "100vh" }}>
      {userData ? (
        <>
          <h1 style={{ fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" }}>Welcome, {userData.username}</h1>
          <div style={{ padding: "20px", backgroundColor: "#333", borderRadius: "8px" }}>
            <Image src={paws} alt="Paws" width={171} height={132} />
          </div>

          <div style={{ padding: "20px", backgroundColor: "#444", borderRadius: "8px" }}>
            <span style={{ fontSize: "1.25rem", fontWeight: "bold" }}>Points: {points}</span>
          </div>

          <div style={{ margin: "10px 0", display: "flex", gap: "10px" }}>
            <button
              onClick={() => setShowTasks(!showTasks)}
              style={{ backgroundColor: "#007BFF", color: "white", padding: "12px 24px", borderRadius: "4px", border: "none", fontSize: "1rem" }}
            >
              Tasks
            </button>
          </div>

          <ReferralSystem userId={userData.id.toString()} />

          {showTasks && (
            <div>
              {activeTasks.map(([key, task]) => (
                <div key={key} style={{ marginBottom: "15px", padding: "12px", backgroundColor: "#555", borderRadius: "6px" }}>
                  <span>{task.label}</span>
                  {task.started ? (
                    <button
                      onClick={() => handleTaskComplete(key as TaskKey)}
                      style={{ marginLeft: "10px", padding: "8px 16px", backgroundColor: "#007BFF", color: "white", borderRadius: "4px" }}
                    >
                      Check
                    </button>
                  ) : (
                    <button
                      onClick={() => handleTaskStart(key as TaskKey)}
                      style={{ marginLeft: "10px", padding: "8px 16px", backgroundColor: "#FFA500", color: "white", borderRadius: "4px" }}
                    >
                      Start
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </main>
  );
}
