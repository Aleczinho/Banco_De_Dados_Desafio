import React, { useState, useEffect } from 'react';
import { categoryAPI } from '../services/api';
import { Card, Form, Button, Table } from 'react-bootstrap';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await categoryAPI.createCategory(newCategory);
      setNewCategory({ name: '', description: '' });
      fetchCategories();
      alert('Categoria criada com sucesso!');
    } catch (error) {
      alert('Erro ao criar categoria: ' + error.message);
    }
  };

  if (loading) return <div>Carregando categorias...</div>;

  return (
    <div>
      <h2 className="mb-4">Gerenciamento de Categorias</h2>
      
      <Card className="mb-4">
        <Card.Body>
          <Card.Title>Criar Nova Categoria</Card.Title>
          <Form onSubmit={handleCreateCategory}>
            <Form.Group className="mb-3">
              <Form.Label>Nome da Categoria</Form.Label>
              <Form.Control
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={newCategory.description}
                onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                placeholder="Opcional"
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Criar Categoria
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Lista de Categorias ({categories.length})</Card.Title>
          <Table striped hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Descrição</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.description || '-'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default CategoryManager;