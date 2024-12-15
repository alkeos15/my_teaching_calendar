document.addEventListener('DOMContentLoaded', () => {
  const studentList = document.getElementById('student-list');
  const addStudentForm = document.getElementById('add-student-form');

  const fetchStudents = async () => {
    const response = await fetch('/students');
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    return await response.json();
  };

  const updateStudentList = async () => {
    try {
      const students = await fetchStudents();
      studentList.innerHTML = '';
      students.forEach(student => {
        const li = document.createElement('li');
        li.innerHTML = `
          <span>${student.name} - ${student.email} (${student.languageLevel})</span>
          <button onclick="editStudent(${student.id})">Edit</button>
          <button onclick="deleteStudent(${student.id})">Delete</button>
        `;
        studentList.appendChild(li);
      });
    } catch (error) {
      console.error('Error updating student list:', error);
    }
  };

  addStudentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(addStudentForm);
    const data = Object.fromEntries(formData);
    try {
      const response = await fetch('/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        await updateStudentList();
        addStudentForm.reset();
      } else {
        console.error('Failed to add student');
      }
    } catch (error) {
      console.error('Error adding student:', error);
    }
  });

  updateStudentList();
});