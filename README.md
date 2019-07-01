# graphql-api

## Требования для нового релиза
* Выбрана следующая версия (semver), в CHANGELOG.md отражены сделанные изменения
* Версии в package.json и package-lock.json изменены соответственно
* Текущее состояние репозитория тегируется и пушится (на этом этапе CI собирает прод сборку, и пушит тегированный docker образ в репозиторий)
```$xslt
git tag 1.0.0
git push origin 1.0.0
```
* Изменяется версия продакшена через модификацию Kubernetes Deployment (production-kube-config.yml) соответственно
* Создаётся pull-request из `develop` в `master`
