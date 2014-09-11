cimentarius
===========

Cimenarius, latin, presumed to mean Mason.

Cimenarius, a Node.JS app, presumed to be a CMS framework, but we'll see where it goes...

A rough scratching ground for a 'ground up' CMS framework. In Node.js :)

Filesystem Layout
-----------------

<pre>
/cimenarius      - The base application and framework
+--/config           - Application installation configuration
+--/controllers      - Controller storage
   +--/admin             - Admin Controllers
+--/lib          - Internal runtime libraries
+--/models           - Database integration
|  +--/shelves           - Actual ORM models
|  +--/database          - ORM setup utils
|   +--/migrations          - Automatic DB upgraders
+--/views       - Template library
   +--/public       - Public Template Packs - for Front End
      +--/default       - Defaule template - these should be one of everything in here...
   +--/admin        - Private Template Packs - for Admin Site
      +--/default       - If you want to edit the admin site, copy this folder and make a new...
+--/tasks       - Grunt tasks
</pre>
