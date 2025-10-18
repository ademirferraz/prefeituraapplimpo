import 'package:flutter/material.dart';
import 'settings_screen.dart';

class WelcomeScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.lightBlue[100],
      appBar: AppBar(title: const Text('Bem-vindo')),
      body: Center(
        child: IconButton(
          icon: const Icon(Icons.settings, size: 40),
          onPressed: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => SettingsScreen()),
            );
          },
        ),
      ),
    );
  }
}