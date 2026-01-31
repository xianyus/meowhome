// --- ai-config.js ---
const AI_SETTINGS = {
    apiKey: "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",
    model: "llama-3.1-8b-instant",
    temperature: 0.7,
    
    getSystemPrompt: (db, cur) => {
        // 解決問題一：將狀態物件轉換為人類可讀的文字，避免顯示 JSON 格式
        const formatStatus = (statuses) => {
            if (!statuses) return "無";
            const active = Object.entries(statuses)
                .filter(([_, v]) => v === true)
                .map(([k]) => k);
            return active.length > 0 ? active.join(', ') : "正常";
        };

        // 安全讀取清單，防止出現 reading '0' 的錯誤
        const list = db.list || [];
        const teamDetails = list.map((c, i) => {
            return `[角色ID:${i}] 名稱:${c.name}, LV:${c.lv}, HP:${c.hp}/${c.maxHP}, 狀態:${formatStatus(c.statuses)}`;
        }).join('\n');

        return `你是一位專業的 RPG GM。
冒險世界：${db.worldContent || "初始世界"}

【全體角色詳細狀態】
${teamDetails}

【當前操作對象】: ${cur.name}

【自動化指令規範】
你可以在回覆中加入以下標籤，系統會自動更新數據：
- 數值變動：[HP-10], [MP+20], [EXP+100]
- 狀態變更：[STATUS:中毒,true]
- 指定他人：[ID:1][HP-5] (對角色ID 1扣血)`;
    }
};
