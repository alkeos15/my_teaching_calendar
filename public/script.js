document.addEventListener('DOMContentLoaded', () => {
  const calendarEl = document.getElementById('calendar');
  const addLessonForm = document.getElementById('add-lesson-form');
  const studentsListButton = document.getElementById('students-list-button');

  // Navigate to Students List Page
  if (studentsListButton) {
    studentsListButton.addEventListener('click', () => {
      window.location.href = '/students/list';
    });
  }

  // Fetch lessons from the server
  const fetchLessons = async () => {
    try {
      const response = await fetch('/lessons');
      if (!response.ok) {
        throw new Error('Failed to fetch lessons');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching lessons:', error);
      return [];
    }
  };

  // Initialize Calendar
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
          id: lesson.id,
          title: lesson.title,
          start: lesson.start,
          end: lesson.end,
          extendedProps: { studentId: lesson.studentId },
        })),
        eventClick: (info) => {
          handleLessonEdit(info.event);
        },
      });
      calendar.render();
    } catch (error) {
      console.error('Error loading calendar:', error);
    }
  };

  // Add Lesson
  if (addLessonForm) {
    addLessonForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(addLessonForm);
      const data = Object.fromEntries(formData);
      try {
        const response = await fetch('/lessons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error('Failed to add lesson');
        }
        addLessonForm.reset();
        initCalendar();
      } catch (error) {
        console.error('Error adding lesson:', error);
      }
    });
  }

  // Edit or Delete Lesson Modal
  const handleLessonEdit = (event) => {
    const lessonId = event.id;
    const modal = document.getElementById('lesson-modal');
    const editForm = document.getElementById('edit-lesson-form');
    const deleteButton = document.getElementById('delete-lesson-btn');

    if (!modal || !editForm || !deleteButton) return;

    // Populate modal with lesson data
    editForm.title.value = event.title;
    editForm.start.value = event.start.toISOString().slice(0, 16);
    editForm.end.value = event.end.toISOString().slice(0, 16);
    editForm.studentId.value = event.extendedProps.studentId;

    modal.style.display = 'block';

    // Close modal
    document.getElementById('close-modal-btn').addEventListener('click', () => {
      modal.style.display = 'none';
    });

    // Update lesson
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const updatedData = {
        title: editForm.title.value,
        start: editForm.start.value,
        end: editForm.end.value,
        studentId: editForm.studentId.value,
      };
      try {
        const response = await fetch(`/lessons/${lessonId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
          throw new Error('Failed to update lesson');
        }
        modal.style.display = 'none';
        initCalendar();
      } catch (error) {
        console.error('Error updating lesson:', error);
      }
    });

    // Delete lesson
    deleteButton.addEventListener('click', async () => {
      if (confirm('Are you sure you want to delete this lesson?')) {
        try {
          const response = await fetch(`/lessons/${lessonId}`, { method: 'DELETE' });
          if (!response.ok) {
            throw new Error('Failed to delete lesson');
          }
          modal.style.display = 'none';
          initCalendar();
        } catch (error) {
          console.error('Error deleting lesson:', error);
        }
      }
    });
  };

  // Initial Calendar Load
  initCalendar();
});