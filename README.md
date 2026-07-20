# Tapşırıq İzləyici (Angular 19, standalone + signals)

Gündəlik məqsədlərini (kurs videoları və ya treyd qazanc hədəfi) klik edərək izləyə biləcəyin proqres tətbiqi.

## Necə işə salmaq olar

```bash
npm install --legacy-peer-deps
npm start
```

Sonra brauzerdə `http://localhost:4200` aç.

## Xüsusiyyətlər

- **Kurs tapşırığı**: ad, neçə günə bitirəcəyini və gündə neçə video izləyəcəyini seç → hər gün üçün ayrı proqres şəbəkəsi yaranır.
- **Treyd hədəfi**: ad, gün sayı və gündəlik dollar hədəfini yaz → avtomatik $5-lik xanalara bölünür.
- Xanaya klik etdikcə rəng dəyişir, gün tamamlananda banner göstərilir.
- Bütün data brauzerin `localStorage`-ında saxlanır (səhifəni bağlasan da qalır).

## Struktur

```
src/app/
  models/         - TypeScript tipləri
  theme/          - rəng və dizayn sabitləri
  services/       - TaskService (signal əsaslı state + localStorage)
  components/
    task-list/    - tapşırıqların siyahısı
    task-form/    - yeni tapşırıq yaratma formu
    task-detail/  - gün seçimi və proqres şəbəkəsi
```

## Texnologiyalar

Angular 19, standalone komponentlər, `inject()`, `signal()` / `computed()`, yeni `@if` / `@for` / `@switch` şablon sintaksisi.
