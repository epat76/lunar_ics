// calendar.js

async function initCalendar() {
  console.log('✅ calendar.js loaded');
  const today = new Date();
  const thisYear = today.getFullYear();
  const thisMonth = today.getMonth() + 1;

  renderCalendar(thisYear, thisMonth);

  const toggleBtn = document.getElementById('calendar-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const calendar = document.getElementById('calendar');
      if (calendar) {
        calendar.style.display = (calendar.style.display === 'none' || calendar.style.display === '') ? 'block' : 'none';
      }
    });
  }
}

function renderCalendar(year, month) {
  const calendarEl = document.getElementById('calendar');
  calendarEl.innerHTML = '';

  const firstDay = new Date(year, month - 1, 1);
  const startDay = firstDay.getDay();
  const lastDate = new Date(year, month, 0).getDate();

  const header = document.createElement('div');
  header.className = 'calendar-header';
  header.innerHTML = `<strong>${year}년 ${month}월</strong>`;
  calendarEl.appendChild(header);

  const grid = document.createElement('div');
  grid.className = 'calendar-grid';

  const days = ['일', '월', '화', '수', '목', '금', '토'];
  days.forEach(d => {
    const cell = document.createElement('div');
    cell.className = 'calendar-cell calendar-day-label';
    cell.textContent = d;
    grid.appendChild(cell);
  });

  for (let i = 0; i < startDay; i++) {
    const empty = document.createElement('div');
    empty.className = 'calendar-cell';
    grid.appendChild(empty);
  }

  for (let d = 1; d <= lastDate; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const cell = document.createElement('div');
    cell.className = 'calendar-cell';
    cell.innerHTML = `<div class="solar-date">${d}</div>`;

    const lunar = lunarData.find(l => l.solar === dateStr);
    if (lunar && d % 5 === 0) {
      const lunarLabel = `${lunar.leap ? '(윤)' : ''}${parseInt(lunar.lunar.split('-')[1])}/${parseInt(lunar.lunar.split('-')[2])}`;
      const lunarDiv = document.createElement('div');
      lunarDiv.className = 'lunar-date';
      lunarDiv.textContent = lunarLabel;
      cell.appendChild(lunarDiv);
    }

    cell.addEventListener('click', () => {
      if (lunar) {
        const [ly, lm, ld] = lunar.lunar.split('-');
        document.getElementById('lunar-year').value = ly;
        document.getElementById('lunar-month').value = parseInt(lm);
        document.getElementById('lunar-day').value = parseInt(ld);
        document.getElementById('is-leap').checked = lunar.leap;
        updateDays();
        updateConvertedList();
        document.getElementById('calendar').style.display = 'none';
      }
    });

    grid.appendChild(cell);
  }

  calendarEl.appendChild(grid);
}

initCalendar();

document.addEventListener('DOMContentLoaded', () => {
  const today = new Date();
  const lunarYear = document.getElementById('lunar-year');
  const lunarMonth = document.getElementById('lunar-month');
  lunarYear.value = today.getFullYear();
  lunarMonth.value = today.getMonth() + 1;
});
