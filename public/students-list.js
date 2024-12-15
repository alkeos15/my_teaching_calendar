document.addEventListener('DOMContentLoaded', () => {
  const addStudentForm = document.getElementById('add-student-form');
  const studentList = document.getElementById('student-list');
  const homeButton = document.getElementById('home-button');

  // Home button functionality
  homeButton.addEventListener('click', () => {
    window.location.href = '/';
  });

  // Fetch and refresh the students list
  const refreshStudentList = async () => {
    try {
      const response = await fetch('/students');
      if (!response.ok) {
        throw new Error('Failed to fetch students');
      }
      const students = await response.json();
      studentList.innerHTML = '';
      students.forEach(student => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${student.name}</strong> - ${student.email} - ${student.phone} - ${student.languageLevel}
          <button class="edit-student" data-id="${student.id}">Edit</button>
          <button class="delete-student" data-id="${student.id}">Delete</button>
        `;
        studentList.appendChild(li);
      });
    } catch (error) {
      console.error('Error updating student list:', error);
    }
  };

  // Add a new student
  addStudentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(addStudentForm);
      const data = Object.fromEntries(formData);
      const response = await fetch('/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Failed to add student');
      }
      addStudentForm.reset();
      refreshStudentList();
    } catch (error) {
      console.error('Error adding student:', error);
    }
  });

  // Handle edit and delete actions
  studentList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-student')) {
      const studentId = e.target.dataset.id;
      try {
        const response = await fetch(`/students/${studentId}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('Failed to delete student');
        }
        refreshStudentList();
      } catch (error) {
        console.error('Error deleting student:', error);
      }
    } else if (e.target.classList.contains('edit-student')) {
      const studentId = e.target.dataset.id;

      try {
        // Fetch existing student details
        const response = await fetch(`/students/${studentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch student details');
        }
        const student = await response.json();

        // Prompt for new values, pre-filling the current values
        const newName = prompt('Enter new name:', student.name) || student.name;
        const newEmail = prompt('Enter new email:', student.email) || student.email;
        const newPhone = prompt('Enter new phone:', student.phone) || student.phone;
        const newLevel = prompt('Enter new language level:', student.languageLevel) || student.languageLevel;

        // Send the updated values to the server
        const updateResponse = await fetch(`/students/${studentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newName,
            email: newEmail,
            phone: newPhone,
            languageLevel: newLevel,
          }),
        });
        if (!updateResponse.ok) {
          throw new Error('Failed to update student');
        }
        refreshStudentList();
      } catch (error) {
        console.error('Error editing student:', error);
      }
    }
  });

  // Initial load
  refreshStudentList();
});