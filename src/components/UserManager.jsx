import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { Card, Form, Button, Table, Image, Alert, Row, Col } from 'react-bootstrap';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({ name: '', email: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await userAPI.createUser(newUser);
      setNewUser({ name: '', email: '' });
      fetchUsers();
      alert('Usuário criado com sucesso!');
    } catch (error) {
      alert('Erro ao criar usuário: ' + error.message);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !selectedFile) {
      alert('Selecione um usuário e um arquivo');
      return;
    }

    try {
      await userAPI.uploadAvatar(selectedUserId, selectedFile);
      setSelectedFile(null);
      fetchUsers();
      alert('Avatar enviado com sucesso!');
    } catch (error) {
      alert('Erro ao enviar avatar: ' + error.message);
    }
  };

  const handleDeleteAvatar = async (userId) => {
    if (window.confirm('Tem certeza que deseja remover o avatar?')) {
      try {
        await userAPI.deleteAvatar(userId);
        fetchUsers();
        alert('Avatar removido com sucesso!');
      } catch (error) {
        alert('Erro ao remover avatar: ' + error.message);
      }
    }
  };

  if (loading) return <div>Carregando usuários...</div>;

  return (
    <div>
      <h2 className="mb-4">Gerenciamento de Usuários</h2>
      
      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Criar Novo Usuário</Card.Title>
              <Form onSubmit={handleCreateUser}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome</Form.Label>
                  <Form.Control
                    type="text"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Criar Usuário
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>Upload de Avatar</Card.Title>
              <Form onSubmit={handleFileUpload}>
                <Form.Group className="mb-3">
                  <Form.Label>Selecionar Usuário</Form.Label>
                  <Form.Select 
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    required
                  >
                    <option value="">Selecione um usuário</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Selecionar Arquivo</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0])}
                    required
                  />
                </Form.Group>
                <Button variant="success" type="submit" disabled={!selectedFile || !selectedUserId}>
                  Enviar Avatar
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Body>
              <Card.Title>Lista de Usuários ({users.length})</Card.Title>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Avatar</th>
                      <th>Nome</th>
                      <th>Email</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>
                          {user.avatar_url ? (
                            <Image src={user.avatar_url} rounded width="50" height="50" />
                          ) : (
                            <div className="text-muted">Sem avatar</div>
                          )}
                        </td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          {user.avatar_url && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteAvatar(user.id)}
                              className="me-2"
                            >
                              Remover Avatar
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default UserManager;