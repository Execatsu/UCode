import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Supondo que você crie um courseService.js
// import { getAllCourses } from '../../api/courseService';
import apiClient from '../../api/axiosInstance'; // Usando apiClient diretamente para simplificar

function CourseListPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // const data = await getAllCourses(); // Usando o service
        const response = await apiClient.get('/cursos'); // Usando apiClient diretamente
        setCourses(response.data);
      } catch (err) {
        setError('Falha ao carregar cursos.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) return <p>Carregando cursos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h1>Nossos Cursos</h1>
      {courses.length === 0 ? (
        <p>Nenhum curso disponível no momento.</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course.id_curso}>
              <Link to={`/cursos/${course.id_curso}`}>
                <h2>{course.nome}</h2>
              </Link>
              <p>{course.descricao?.substring(0,100)}...</p>
              <p>Nível: {course.nivel_dificuldade}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CourseListPage;