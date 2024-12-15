document.addEventListener('DOMContentLoaded', () => {
  // Initialize the calendar
  const calendarEl = document.getElementById('calendar');
  const fetchLessons = async () => {
    const response = await fetch('/lessons');
    if (!response.ok) throw new Error('Failed to fetch lessons');
    return await response.json();
  };

  const initCalendar = async () => {
    try {
      const lessons = await fetchLessons();
      const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        events: lessons.map(lesson => ({
          title: lesson.title,
          start: lesson.start,
          end: lesson.end,
        })),
      });
      calendar.render();
    } catch (error) {
      console.error('Error loading calendar events:', error);
    }
  };

  if (calendarEl) initCalendar();

  // Add a new lesson
  const bookLessonForm = document.getElementById('book-lesson-form');
  if (bookLessonForm) {
    bookLessonForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(bookLessonForm);
      const data = Object.fromEntries(formData);
      await fetch('/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      bookLessonForm.reset();
      initCalendar();
    });
  }

  // Handle student management
  const addStudentForm = document.getElementById('add-student-form');
  const studentList = document.getElementById('student-list');

  const fetchStudents = async () => {
    const response = await fetch('/students');
    const students = await response.json();
    studentList.innerHTML = '';
    students.forEach(student => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${student.name} (${student.languageLevel})</span>
        <button class="edit-student" data-id="${student.id}">Edit</button>
        <button class="delete-student" data-id="${student.id}">Delete</button>
      `;
      studentList.appendChild(li);
    });
  };

  if (addStudentForm) {
    addStudentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addStudentForm);
      const data = Object.fromEntries(formData);
      await fetch('/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      addStudentForm.reset();
      fetchStudents();
    });
  }

  if (studentList) {
    studentList.addEventListener('click', async (e) => {
      const target = e.target;
      const id = target.dataset.id;

      if (target.classList.contains('delete-student')) {
        await fetch(`/students/${id}`, { method: 'DELETE' });
        fetchStudents();
      } else if (target.classList.contains('edit-student')) {
        const newName = prompt('Enter new name:');
        if (newName) {
          await fetch(`/students/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName }),
          });
          fetchStudents();
        }
      }
    });

    fetchStudents();
  }
});