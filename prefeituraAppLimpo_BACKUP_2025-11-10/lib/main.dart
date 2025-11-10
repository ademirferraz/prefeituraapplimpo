import 'package:flutter/material.dart';
import 'screens/welcome_screen.dart';

void main() {
  runApp(PrefeituraApp());
}

class PrefeituraApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'App Prefeitura',
      theme: ThemeData(
        primarySwatch: Colors.lightBlue,
      ),
      home: WelcomeScreen(),
    );
  }
}