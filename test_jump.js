const dateUtil = {
  formatDate: (year, month, day) => `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
};

function testJump(targetDate) {
  console.log('Testing jump to:', targetDate);
  const parts = targetDate.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]);
  const day = parseInt(parts[2]);

  console.log('Parsed - Year:', year, 'Month:', month, 'Day:', day);
  
  const selectedKey = dateUtil.formatDate(year, month, day);
  console.log('Selected Key:', selectedKey);

  if (month === 10 && targetDate.includes('-10-')) {
    console.log('SUCCESS: Jumped to October');
  } else if (month === 9 && targetDate.includes('-10-')) {
    console.log('FAILURE: Jumped to September instead of October');
  }
}

testJump('2026-09-25'); // 中秋节
testJump('2026-10-01'); // 国庆节
