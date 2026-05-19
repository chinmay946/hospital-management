// Chart Utilities - Hospital Management System

class ChartUtils {
    static initAdmissionChart(canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        // Simple bar chart for patient admissions
        this.drawBarChart(ctx, {
            title: 'Patient Admissions',
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [45, 52, 48, 61, 55, 67],
            color: '#2563eb'
        });
    }

    static initDepartmentChart(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const departments = [
            { name: 'Cardiology', patients: 150 },
            { name: 'Neurology', patients: 120 },
            { name: 'Orthopedics', patients: 100 },
            { name: 'General', patients: 200 },
            { name: 'Pediatrics', patients: 80 }
        ];

        this.drawPieChart(container, departments);
    }

    static drawBarChart(ctx, options) {
        const { title, labels, data, color } = options;
        const padding = 40;
        const width = ctx.canvas.width;
        const height = ctx.canvas.height;
        const chartWidth = width - padding * 2;
        const chartHeight = height - padding * 2;
        const barWidth = chartWidth / labels.length;
        const maxValue = Math.max(...data);

        // Draw background
        ctx.fillStyle = '#f9fafb';
        ctx.fillRect(0, 0, width, height);

        // Draw grid lines
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }

        // Draw bars
        ctx.fillStyle = color;
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = padding + index * barWidth + barWidth * 0.1;
            const y = height - padding - barHeight;
            const actualBarWidth = barWidth * 0.8;

            ctx.fillRect(x, y, actualBarWidth, barHeight);
        });

        // Draw labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        labels.forEach((label, index) => {
            const x = padding + index * barWidth + barWidth / 2;
            const y = height - padding + 20;
            ctx.fillText(label, x, y);
        });

        // Draw Y-axis labels
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = Math.round((maxValue / 5) * i);
            const y = height - padding - (chartHeight / 5) * i + 4;
            ctx.fillText(value, padding - 10, y);
        }

        // Draw axes
        ctx.strokeStyle = '#111827';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, height - padding);
        ctx.lineTo(width - padding, height - padding);
        ctx.stroke();
    }

    static drawPieChart(container, data) {
        const total = data.reduce((sum, item) => sum + item.patients, 0);
        const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
        
        let html = '<div style="display: flex; gap: 30px; align-items: center;">';
        
        // Draw legend
        html += '<div style="flex: 1;">';
        data.forEach((item, index) => {
            const percentage = ((item.patients / total) * 100).toFixed(1);
            html += `
                <div style="margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    <div style="width: 12px; height: 12px; background: ${colors[index]}; border-radius: 2px;"></div>
                    <span style="font-size: 14px;">${item.name} (${percentage}%)</span>
                </div>
            `;
        });
        html += '</div>';
        
        // Draw pie chart
        html += '<div style="flex: 1;">';
        html += this.createPieChartSVG(data, colors, total);
        html += '</div>';
        
        html += '</div>';
        container.innerHTML = html;
    }

    static createPieChartSVG(data, colors, total) {
        const size = 200;
        const radius = size / 2 - 10;
        const centerX = size / 2;
        const centerY = size / 2;
        
        let svg = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
        
        let currentAngle = -Math.PI / 2;
        
        data.forEach((item, index) => {
            const sliceAngle = (item.patients / total) * 2 * Math.PI;
            const startX = centerX + radius * Math.cos(currentAngle);
            const startY = centerY + radius * Math.sin(currentAngle);
            const endAngle = currentAngle + sliceAngle;
            const endX = centerX + radius * Math.cos(endAngle);
            const endY = centerY + radius * Math.sin(endAngle);
            
            const largeArc = sliceAngle > Math.PI ? 1 : 0;
            const pathData = [
                `M ${centerX} ${centerY}`,
                `L ${startX} ${startY}`,
                `A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY}`,
                'Z'
            ].join(' ');
            
            svg += `<path d="${pathData}" fill="${colors[index]}" stroke="white" stroke-width="2"/>`;
            
            currentAngle = endAngle;
        });
        
        svg += '</svg>';
        return svg;
    }

    static createSimpleChart(data) {
        const maxValue = Math.max(...data);
        let html = '<div style="display: flex; align-items: flex-end; gap: 8px; height: 200px;">';
        
        data.forEach((value) => {
            const height = (value / maxValue) * 100;
            html += `
                <div style="
                    flex: 1;
                    height: ${height}%;
                    background: linear-gradient(180deg, #2563eb, #1d4ed8);
                    border-radius: 4px 4px 0 0;
                    position: relative;
                ">
                    <span style="
                        position: absolute;
                        top: -25px;
                        left: 50%;
                        transform: translateX(-50%);
                        font-size: 12px;
                        font-weight: 600;
                    ">${value}</span>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChartUtils;
}
