"""
Migration: Drop orphaned old tables and create current schema.

Run directly:  python migrate_cleanup.py
"""

from app import create_app
from database import db
from sqlalchemy import inspect


def main():
    app = create_app()

    OLD_TABLES = ['order_item', 'message', 'order', 'product']  # reverse dependency order

    with app.app_context():
        inspector = inspect(db.engine)
        existing = set(inspector.get_table_names())

        print('=== Existing tables in database ===')
        for t in sorted(existing):
            print('  ' + t)

        orphaned = [t for t in OLD_TABLES if t in existing]
        if orphaned:
            print('\n=== Dropping orphaned old tables ===')
            for t in orphaned:
                print('  Dropping ' + t + '...')
                db.session.execute(db.text('DROP TABLE IF EXISTS "' + t + '"'))
            db.session.commit()
            print('  Done.')

        print('\n=== Ensuring current tables exist ===')
        db.create_all()
        print('  Done.')

        inspector = inspect(db.engine)
        remaining = set(inspector.get_table_names())
        print('\n=== Tables after migration ===')
        for t in sorted(remaining):
            cols = inspector.get_columns(t)
            pk_names = [c['name'] for c in cols if c.get('primary_key')]
            fks = inspector.get_foreign_keys(t)
            fk_str = ', '.join(
                '{} -> {}.{}'.format(f['constrained_columns'], f['referred_table'], f['referred_columns'])
                for f in fks
            )
            print('  {:<20} PK={:<25} FK={}'.format(t, str(pk_names), fk_str))

        still_orphaned = [t for t in OLD_TABLES if t in remaining]
        if still_orphaned:
            print('\nWARNING: Old tables still present:', still_orphaned)
        else:
            print('\nSUCCESS: All orphaned tables removed, schema is clean.')


if __name__ == "__main__":
    main()
