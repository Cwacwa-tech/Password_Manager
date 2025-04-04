"""changed user_id to user_email to vault_entries mode
l

Revision ID: 48be096d839e
Revises: 343da517d126
Create Date: 2025-02-05 20:47:40.512079

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '48be096d839e'
down_revision: Union[str, None] = '343da517d126'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('vault_entries', sa.Column('user_email', sa.String(), nullable=True))
    op.drop_index('ix_vault_entries_user_id', table_name='vault_entries')
    op.create_index(op.f('ix_vault_entries_user_email'), 'vault_entries', ['user_email'], unique=False)
    op.drop_constraint('vault_entries_user_id_fkey', 'vault_entries', type_='foreignkey')
    op.create_foreign_key(None, 'vault_entries', 'users', ['user_email'], ['email'])
    op.drop_column('vault_entries', 'user_id')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('vault_entries', sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_constraint(None, 'vault_entries', type_='foreignkey')
    op.create_foreign_key('vault_entries_user_id_fkey', 'vault_entries', 'users', ['user_id'], ['id'])
    op.drop_index(op.f('ix_vault_entries_user_email'), table_name='vault_entries')
    op.create_index('ix_vault_entries_user_id', 'vault_entries', ['user_id'], unique=False)
    op.drop_column('vault_entries', 'user_email')
    # ### end Alembic commands ###
