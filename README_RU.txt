MESHCHERCLUB — подключаемая версия Cinematic v3

Что уже настроено в Supabase:
- проект: uxkwjpurxroopwslqdpe (Stockholm)
- таблицы profiles и articles, RLS-политики и безопасная проверка роли owner
- при регистрации профиль создаётся автоматически с ролью member

ПЕРЕД ПУБЛИКАЦИЕЙ:
1. Для подтверждения регистрации используется стандартная ссылка Supabase из письма Confirm signup. Менять шаблон письма и вставлять OTP-код не нужно.
2. Убедитесь, что Email provider включён и Confirm email включён.
3. В Authentication → URL Configuration задайте Site URL и Redirect URLs на адрес будущего сайта.
4. В config.js уже указан публичный publishable key проекта. service_role/secret key сюда НЕ вставлять.
5. В config.js вставьте publishable key проекта (Project Settings → API Keys → Publishable key). Это публичный ключ; service_role/secret key сюда НЕ вставлять.
6. Выложите содержимое папки на HTTPS-хостинг.

ВАЖНО: пароль не передавайте в чат. Для реальной отправки писем в production рекомендуется настроить собственный SMTP-провайдер в Supabase Auth → SMTP Settings. Бесплатный тариф Supabase имеет ограничения на отправку почты.

НАЗНАЧЕНИЕ OWNER:
После того как вы самостоятельно зарегистрируетесь и подтвердите email foxymusicever@gmail.com, выполните в Supabase SQL Editor одноразовый запрос:
UPDATE public.profiles p SET role='owner' FROM auth.users u WHERE p.id=u.id AND lower(u.email)=lower('foxymusicever@gmail.com') AND u.email_confirmed_at IS NOT NULL;
Не запускайте запрос до регистрации и подтверждения почты. Другим пользователям роль owner не назначайте.

Статьи можно добавлять через Table Editor → articles. category: chess / martial_arts / warriors_path / gym. status=published показывает статью подтверждённым вошедшим пользователям; draft/hidden скрыты от них.

Визуальный стиль Cinematic v3 сохранён. Этот архив содержит frontend; он не опубликован автоматически.
