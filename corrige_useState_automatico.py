#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import re
import shutil
from pathlib import Path

# ================================
# LISTA DOS 20 ARQUIVOS
# ================================
ARQUIVOS_CRITICOS = [
    r"D:\projetos\prefeituraAppLimpo\screens\AdminLoginScreen.js",
    r"D:\projetos\prefeituraAppLimpo\screens\CadastroScreen.js",
    r"D:\projetos\prefeituraAppLimpo\screens\CadastroScreen.old.js",
    r"D:\projetos\prefeituraAppLimpo\screens\DenunciaScreen.js",
    r"D:\projetos\prefeituraAppLimpo\screens\EditarInformacoesScreen.js",
    r"D:\projetos\prefeituraAppLimpo\screens\ElogiosScreen.js",
    r"D:\projetos\prefeituraAppLimpo\screens\EnviarScreen.js",
    r"D:\projetos\prefeituraAppLimpo\screens\EventosPessoaisScreen.js",
    r"D:\projetos\prefeituraAppLimpo\screens\GaleriaScreen.js",
    r"D:\projetos\prefeituraAppLimpo\screens\GravarMidiaScreen.js",
    r"D:\projetos\prefeituraAppLimpo\screens\HistoricoScreen.js",
    r"D:\projetos\prefeituraAppLimpo\screens\HomeScreen.js",
    r"D:\projetos\prefeituraAppLimpo\screens\InformacoesScreen.js",
    r"D:\projetos\prefeituraAppLimpo\screens\InicioScreen.js",
    r"D:\projetos\prefeituraAppLimpo\screens\LoginScreen.js",
    r"D:\projetos\prefeituraAppLimpo\screens\PainelAdminScreen.js",
    r"D:\projetos\prefeituraAppLimpo\screens\PerigoScreen.js",
    r"D:\projetos\prefeituraAppLimpo\screens\RecuperarSenhaScreen.js",
    r"D:\projetos\prefeituraAppLimpo\screens\ServicosScreen.js",
    r"D:\projetos\prefeituraAppLimpo\screens\SugestaoScreen.js",
]

# ================================
# CONFIGURAÇÕES
# ================================
VALORES_RUINS = {'""', "''", 'null', 'undefined', '[]', '{}', '0', 'false'}
IGNORAR_VARIAVEIS = {
    'loading', 'isloading', 'error', 'iserror', 'visible', 'isvisible',
    'modalvisible', 'refreshing', 'isrefreshing', 'active', 'selected', 'index'
}

padrao_useState = re.compile(
    r'(?:const|let|var)\s*'
    r'(?:\[(?P<estado>\w+),\s*(?P<set>\w+)\]\s*=\s*)?'
    r'(?:(?P<nome>\w+)\s*=\s*)?'
    r'useState\s*\(\s*(?P<valor>[^)]*?)\s*\)\s*;?',
    re.IGNORECASE
)

RELATORIO = Path("relatorio_correcoes.txt")
BACKUP_DIR = Path("backup_correcoes")
BACKUP_DIR.mkdir(exist_ok=True)

correcoes = []

# ================================
def valor_reset(valor):
    if valor in {'""', "''"}: return '""'
    if valor == '[]': return '[]'
    if valor == '{}': return '{}'
    if valor in {'0', 'false'}: return 'false'
    return '""'

# ================================
def corrigir_arquivo(caminho: Path):
    if not caminho.exists():
        print(f"[AVISO] Não encontrado: {caminho.name}")
        return

    try:
        texto = caminho.read_text(encoding="utf-8", errors="ignore")
        linhas = texto.splitlines()
    except Exception as e:
        print(f"[ERRO] Leitura: {caminho.name} → {e}")
        return

    # Backup
    backup = BACKUP_DIR / f"{caminho.name}.backup"
    shutil.copy2(caminho, backup)

    # Encontrar useState problemáticos
    estados = []
    for i, linha in enumerate(linhas):
        m = padrao_useState.search(linha)
        if not m: continue
        estado = m.group('estado') or m.group('nome')
        valor = (m.group('valor') or '').strip()
        if not estado or estado.lower() in IGNORAR_VARIAVEIS: continue
        if valor not in VALORES_RUINS: continue
        estados.append((estado, valor, i))

    if not estados:
        return

    # Gerar setEstado
    sets = []
    for estado, _, _ in estados:
        set_nome = f"set{estado[0].upper()}{estado[1:]}"
        sets.append(set_nome)

    # CÓDIGO DE LIMPEZA (string normal, sem f"")
    limpeza = [
        "",
        "  // === LIMPEZA AUTOMÁTICA DE ESTADOS AO SAIR DA TELA ===",
        "  useFocusEffect(",
        "    useCallback(() => {",
        "      return () => {",
        "        " + "; ".join(f"{s}({valor_reset(v)})" for s, (_, v, _) in zip(sets, estados)) + ";",
        "      };",
        "    }, [])",
        "  );",
        ""
    ]

    # Adicionar imports
    if "useFocusEffect" not in texto:
        texto = "import { useFocusEffect } from '@react-navigation/native';\n" + texto
    if "useCallback" not in texto:
        texto = "import { useCallback } from 'react';\n" + texto

    # Inserir após último useState
    ultima_linha = max(i for _, _, i in estados)
    for j, linha_limpeza in enumerate(limpeza):
        linhas.insert(ultima_linha + 1 + j, linha_limpeza)

    # Salvar
    caminho.write_text("\n".join(linhas), encoding="utf-8")

    correcoes.append({
        'arquivo': caminho.name,
        'estados': [e[0] for e in estados],
        'backup': backup
    })
    print(f"  CORRIGIDO: {', '.join([e[0] for e in estados])}")

# ================================
def main():
    print("INICIANDO CORREÇÕES AUTOMÁTICAS (20 TELAS)...\n")
    for p in ARQUIVOS_CRITICOS:
        caminho = Path(p)
        print(f"Processando: {caminho.name}...", end="")
        corrigir_arquivo(caminho)
        if caminho.name not in [c['arquivo'] for c in correcoes]:
            print(" OK")

    # Relatório
    with open(RELATORIO, "w", encoding="utf-8") as f:
        f.write("RELATÓRIO DE CORREÇÕES AUTOMÁTICAS\n")
        f.write("=" * 50 + "\n\n")
        if not correcoes:
            f.write("Nenhum useState com valor inicial ruim encontrado.\n")
        else:
            f.write(f"{len(correcoes)} arquivo(s) corrigidos:\n\n")
            for c in correcoes:
                f.write(f"{c['arquivo']}\n")
                f.write(f"   → {', '.join(c['estados'])}\n")
                f.write(f"   Backup: {c['backup']}\n\n")
        f.write("Backups salvos em: ./backup_correcoes/\n")

    print(f"\nCONCLUÍDO! {len(correcoes)} arquivos corrigidos.")
    print(f"Relatório: {RELATORIO}")
    print(f"Backups: {BACKUP_DIR}")

if __name__ == "__main__":
    main()