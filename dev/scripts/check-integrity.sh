#!/bin/bash
# Скрипт для проверки целостности проекта

echo "========================================"
echo "Проверка целостности проекта"
echo "========================================"
echo ""

# Проверка HTML файлов
echo "✓ Проверка HTML файлов..."
for file in index.html rules.html cards.html about.html; do
    if [ -f "$file" ]; then
        echo "  ✓ $file - найден"
    else
        echo "  ✗ $file - НЕ найден"
    fi
done

echo ""
echo "✓ Проверка CSS файлов..."
for file in css/styles.css css/fantasy.css; do
    if [ -f "$file" ]; then
        echo "  ✓ $file - найден"
    else
        echo "  ✗ $file - НЕ найден"
    fi
done

echo ""
echo "✓ Проверка JavaScript файлов..."
for file in js/data.js js/storage.js js/main.js js/rules.js js/animations.js js/dynamic-content.js js/rules-loader.js; do
    if [ -f "$file" ]; then
        echo "  ✓ $file - найден"
    else
        echo "  ✗ $file - НЕ найден"
    fi
done

echo ""
echo "✓ Проверка документации..."
for file in README.md PROJECT_SUMMARY.md; do
    if [ -f "$file" ]; then
        echo "  ✓ $file - найден"
    else
        echo "  ✗ $file - НЕ найден"
    fi
done

echo ""
echo "✓ Проверка папок..."
for dir in data images pdf css js; do
    if [ -d "$dir" ]; then
        echo "  ✓ $dir/ - найдена"
    else
        echo "  ✗ $dir/ - НЕ найдена"
    fi
done

echo ""
echo "========================================"
echo "Проверка завершена!"
echo "========================================"
echo ""
echo "📌 Следующие шаги:"
echo "1. Добавьте видео: /images/hero-background.mp4"
echo "2. Откройте index.html для просмотра результатов"
echo ""
