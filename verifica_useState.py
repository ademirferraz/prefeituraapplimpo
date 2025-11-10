#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
analisa_useState_20_telas.py

Analisa APENAS os 20 arquivos críticos listados abaixo.
- Extrai useState
- Detecta valores iniciais ruins
- Identifica estados duplicados
- Sugere useFocusEffect
- Gera relatório.txt + relatório.csv
"""

import re
from pathlib import Path
from collections import defaultdict
import csv

# ================================
# LISTA DOS 20 ARQUIVOS CRÍTICOS
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
VALORES_RUINS = {'""', "''", 'null', 'undefined', '[]', '{}', '0', 'false', 'vazio'}
IGNORAR_VARIAVEIS = {
    'loading', 'isLoading', 'error', 'isError', 'visible', 'isVisible',
    'modalVisible', 'refreshing', 'isRefreshing', 'active', 'selected', 'index'
}

padrao_useState = re.compile(
    r'(?:const|let|var)\s*'                     # declaração
    r'(?:\[(?P<estado>\w+),\s*(?P<set>\w+)\]\s*=\s*)?'  # [estado, setEstado]
    r'(?:(?P<nome>\w+)\s*=\s*)?'                # nome opcional
    r'useState\s*\(\s*(?P<valor>[^)]*?)\s*\)\s*;?',  # valor
    re.IGNORECASE
)

RELATORIO_TXT = Path("relatorio_useState.txt")
RELATORIO_CSV = Path("relatorio_useState.csv")

# ================================
# DADOS
# ================================
estados_por_arquivo = {}
estados_globais = defaultdict(list)

# ================================
# FUNÇÃO: Analisar arquivo
# ================================
def analisar_arquivo(caminho: Path):
    if not caminho.exists():
        print(f"[AVISO] Arquivo não encontrado: {caminho.name}")
        return

    try:
        texto = caminho.read_text(encoding="utf-8", errors="ignore")
        linhas = texto.splitlines()
    except Exception as e:
        print(f"[ERRO] Falha ao ler {caminho.name}: {e}")
        return

    estados_locais = []
    for num, linha in enumerate(linhas, 1):
        match = padrao_useState.search(linha.strip())
        if not match:
            continue

        estado = match.group('estado') or match.group('nome') or 'desconhecido'
        valor = (match.group('valor') or '').strip()
        valor_norm = valor if valor else 'vazio'

        if estado.lower() in {v.lower() for v in IGNORAR_VARIAVEIS}:
            continue

        estado_info = {
            'variavel': estado,
            'valor': valor_norm,
            'linha': num,
            'arquivo': caminho
        }
        estados_locais.append(estado_info)
        estados_globais[estado].append(caminho)

    if estados_locais:
        estados_por_arquivo[caminho] = estados_locais

# ================================
# MAIN
# ================================
def main():
    print("ANALISANDO 20 TELAS CRÍTICAS...\n")
    arquivos_paths = [Path(p) for p in ARQUIVOS_CRITICOS]

    # Analisar
    for caminho in arquivos_paths:
        analisar_arquivo(caminho)

    # Detectar duplicados
    duplicados = {var: paths for var, paths in estados_globais.items() if len(paths) > 1}

    # Gerar relatórios
    with RELATORIO_TXT.open("w", encoding="utf-8") as txt, \
         RELATORIO_CSV.open("w", encoding="utf-8", newline="") as csvfile:

        writer = csv.writer(csvfile)
        writer.writerow(["Arquivo", "Variável", "Valor Inicial", "Linha", "Sugestão"])

        txt.write("RELATÓRIO DE useState - 20 TELAS CRÍTICAS\n")
        txt.write("=" * 70 + "\n\n")

        # 1. VALORES INICIAIS RUINS
        txt.write("1. ESTADOS COM VALORES INICIAIS INDEVIDOS\n")
        txt.write("-" * 50 + "\n")
        problematicos = 0

        for arquivo, estados in estados_por_arquivo.items():
            for est in estados:
                if est['valor'] in VALORES_RUINS:
                    problematicos += 1
                    sugestao = "Limpar com useFocusEffect ao sair da tela"
                    txt.write(f"{arquivo.name}\n")
                    txt.write(f"   → {est['variavel']} = useState({est['valor']})\n")
                    txt.write(f"     Linha {est['linha']} | {sugestao}\n\n")
                    writer.writerow([arquivo.name, est['variavel'], est['valor'], est['linha'], sugestao])

        if problematicos == 0:
            txt.write("Nenhum valor inicial problemático encontrado.\n\n")

        # 2. ESTADOS DUPLICADOS
        txt.write("\n2. ESTADOS DUPLICADOS ENTRE TELAS\n")
        txt.write("-" * 50 + "\n")
        if duplicados:
            for var, arquivos in duplicados.items():
                txt.write(f"{var} → usado em {len(arquivos)} telas:\n")
                for arq in arquivos:
                    txt.write(f"   • {arq.name}\n")
                txt.write("\n")
        else:
            txt.write("Nenhum estado duplicado.\n")

        # RESUMO
        txt.write("\n" + "=" * 70 + "\n")
        txt.write("RESUMO\n")
        analisados = len([p for p in arquivos_paths if p.exists()])
        txt.write(f"Telas analisadas: {analisados}/20\n")
        txt.write(f"useState encontrados: {sum(len(v) for v in estados_por_arquivo.values())}\n")
        txt.write(f"Estados problemáticos: {problematicos}\n")
        txt.write(f"Estados duplicados: {len(duplicados)}\n")
        txt.write(f"\nRelatórios gerados:\n   • {RELATORIO_TXT}\n   • {RELATORIO_CSV}\n")

    print("Análise concluída!")
    print(f"Relatório: {RELATORIO_TXT}")
    print(f"CSV: {RELATORIO_CSV}")

# ================================
if __name__ == "__main__":
    main()