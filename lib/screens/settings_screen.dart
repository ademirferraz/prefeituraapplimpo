import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  final adminPassword = 'admin123';

  void checkAdminAccess(BuildContext context) {
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (_) {
        final controller = TextEditingController();
        return AlertDialog(
          title: const Text('Senha do administrador'),
          content: TextField(
            controller: controller,
            obscureText: true,
            decoration: const InputDecoration(hintText: 'Digite a senha'),
          ),
          actions: [
            TextButton(
              child: const Text('Cancelar'),
              onPressed: () => Navigator.of(context).pop(),
            ),
            TextButton(
              child: const Text('Entrar'),
              onPressed: () {
                final ok = controller.text == adminPassword;
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  SnackBar(content: Text(ok ? 'Acesso liberado' : 'Senha incorreta')),
                );
                if (ok) {
                  // TODO: navegar para Painel Administrativo quando disponível
                }
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.lightBlue[100],
      body: Center(
        child: IconButton(
          icon: const Icon(Icons.settings, size: 40),
          onPressed: () => checkAdminAccess(context),
        ),
      ),
    );
  }
}