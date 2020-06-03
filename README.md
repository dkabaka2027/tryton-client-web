# Tryton Client (Web)
The Tryton Web Client built using Angular 8 and Nebular 4. It's intended purpose is to improve the UX of the current SAO web interface by improving on navigation and removing the current windowed mode borrowed heavily from the GTK client. The main intention was to use it for GNU Health, as we are currently working on enabling Software as a Service functions on the server to allow multiple organisations to utilise one instance of the application.  

Currently, the client implements the following features:
+ DB Authentication;
+ User Context and Session Stores;
+ View Parsing and Rendering;
+ Dynamic List Views;
+ Dynamic Forms (without layout grid options);
+ Dynamic filtering in list views;
+ Dynamic actions in list views;
+ PYSON parsing and bindings;
+ Wizards;
+ Translations;

### TODO
+ Grid Layouts;
+ Nested properties for DateTime fields;
+ Domain Parsing in both list and form views;
+ Federated Authentication using HOST url to fetch DB;
+ Infinite scroll list views;
