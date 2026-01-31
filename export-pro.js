/**
 * 神諭之書 - 高級匯出插件 (Independent Pro Export Plugin)
 * 功能：提供更精美的 Word 排版，支援表格、進度條與顏色標註。
 */

const ExportPro = {
    // 核心樣式定義 (Word 支援的 CSS)
    styles: `
        <style>
            body { font-family: 'PingFang TC', 'Microsoft JhengHei', sans-serif; line-height: 1.6; color: #1e293b; }
            .doc-header { background-color: #0f172a; color: #38bdf8; padding: 30px; text-align: center; border-bottom: 5px solid #38bdf8; }
            .section-title { background: #f1f5f9; border-left: 8px solid #38bdf8; padding: 10px; margin: 25px 0 10px 0; font-size: 20px; font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background-color: #f8fafc; border: 1px solid #cbd5e1; padding: 12px; text-align: left; color: #475569; }
            td { border: 1px solid #cbd5e1; padding: 12px; vertical-align: top; }
            .stat-label { font-weight: bold; color: #64748b; width: 20%; }
            .stat-value { width: 30%; }
            .badge { padding: 4px 10px; border-radius: 15px; font-size: 12px; font-weight: bold; color: white; }
            .hp { background-color: #ef4444; } .mp { background-color: #3b82f6; } .sp { background-color: #10b981; }
            .quest-box { border: 1px solid #fbbf24; background: #fffbeb; padding: 15px; margin-bottom: 10px; border-radius: 8px; }
            .progress-bg { background: #e2e8f0; height: 12px; border-radius: 6px; margin-top: 5px; width: 100%; }
            .progress-fill { background: #fbbf24; height: 12px; border-radius: 6px; }
            .footer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 50px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
        </style>
    `,

    // 格式化狀態文字
    formatStatus(statuses) {
        if (!statuses) return "正常";
        const active = Object.entries(statuses).filter(([_, v]) => v).map(([k]) => k);
        return active.length > 0 ? active.join(', ') : "正常";
    },

    // 核心下載邏輯
    download(content, filename) {
        const header = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'>${this.styles}</head><body>`;
        const footer = `<div class="footer">由 神諭之書 - 終極自動化終端 生成</div></body></html>`;
        const blob = new Blob([header + content + footer], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = `${filename}.doc`; a.click();
        URL.revokeObjectURL(url);
    },

    // 導出當前角色
    exportCurrent() {
        if (typeof getCur !== 'function') return alert("找不到角色數據！");
        const c = getCur();
        
        let html = `
            <div class="doc-header">
                <h1>冒險者檔案：${c.name}</h1>
                <p>等級 Lv. ${c.lv || 1} | 狀態：${this.formatStatus(c.statuses)}</p>
            </div>

            <div class="section-title">核心屬性數據</div>
            <table>
                <tr>
                    <th class="stat-label">生命值 (HP)</th><td class="stat-value"><span class="badge hp">${c.hp} / ${c.maxHP}</span></td>
                    <th class="stat-label">魔力值 (MP)</th><td class="stat-value"><span class="badge mp">${c.mp} / ${c.maxMP}</span></td>
                </tr>
                <tr>
                    <th class="stat-label">體力值 (SP)</th><td class="stat-value"><span class="badge sp">${c.sp} / ${c.maxSP}</span></td>
                    <th class="stat-label">經驗值 (EXP)</th><td class="stat-value">${c.exp || 0}</td>
                </tr>
            </table>

            <div class="section-title">戰鬥能力評分</div>
            <table>
                <tr><th>攻擊 (ATK)</th><th>魔法 (MAG)</th><th>防禦 (DEF)</th><th>速度 (SPD)</th><th>幸運 (LUK)</th></tr>
                <tr><td>${c.atk}</td><td>${c.mag}</td><td>${c.def}</td><td>${c.spd}</td><td>${c.luk}</td></tr>
            </table>

            <div class="section-title">持有技能與天賦</div>
            <table>
                <tr><th style="width:30%">技能名稱</th><th>效果描述</th></tr>
                ${(c.abilities || []).map(a => `<tr><td><b>${a.n}</b></td><td>${a.e}</td></tr>`).join('')}
            </table>

            <div class="section-title">目前任務進度</div>
            ${(c.quests || []).map(q => {
                const percent = Math.min(100, Math.floor((q.cur / q.tar) * 100));
                return `
                    <div class="quest-box">
                        <b>${q.n}</b> (進度: ${q.cur} / ${q.tar})
                        <div class="progress-bg"><div class="progress-fill" style="width: ${percent}%;"></div></div>
                    </div>
                `;
            }).join('')}
        `;

        this.download(html, `角色檔案_${c.name}`);
    }
};

// 自動在頁面上增加一個「精美導出」按鈕 (不更動原 HTML 結構，動態插入)
(function injectButton() {
    const btn = document.createElement("button");
    btn.innerHTML = "✨ 精美 Doc 匯出";
    btn.style.cssText = "position:fixed; bottom:80px; right:20px; z-index:9999; padding:10px 20px; background:#38bdf8; color:white; border:none; border-radius:20px; cursor:pointer; box-shadow:0 4px 6px rgba(0,0,0,0.1); font-weight:bold;";
    btn.onclick = () => ExportPro.exportCurrent();
    document.body.appendChild(btn);
})();
