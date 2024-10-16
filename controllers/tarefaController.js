const db = require('../db/database');

exports.createTarefa = (req, res) => {
    const { tarefa } = req.body;
    db.run("INSERT INTO tarefas (tarefa) VALUES (?)", [tarefa], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, tarefa });
    });
};

exports.getTarefas = (req, res) => {
    db.all("SELECT * FROM tarefas", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
};

exports.getTarefaById = (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM tarefas WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.status(200).json(row);
        } else {
            res.status(404).json({ error: 'Tarefa não encontrada!' });
        }
    });
};

exports.updateTarefa = (req, res) => {
    const { id } = req.params;
    const { tarefa } = req.body;

    // Verifica se o usuário é admin antes de tentar atualizar a tarefa
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem atualizar ou deletar tarefas.' });
    }

    // Se for admin, tenta atualizar a tarefa
    db.run("UPDATE tarefas SET tarefa = ? WHERE id = ?", [tarefa, id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes) {
            res.status(200).json({ message: 'Tarefa atualizada com sucesso!' });
        } else {
            res.status(404).json({ error: 'Tarefa não encontrada!' });
        }
    });
};

exports.deleteTarefa = (req, res) => {
    const { id } = req.params;

    // Verifica se o usuário é admin antes de tentar deletar a tarefa
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem atualizar ou deletar tarefas.' });
    }

    // Se for admin, tenta deletar a tarefa
    db.run("DELETE FROM tarefas WHERE id = ?", [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes) {
            res.status(200).json({ message: 'Tarefa removida com sucesso!' });
        } else {
            res.status(404).json({ error: 'Tarefa não encontrada!' });
        }
    });
};