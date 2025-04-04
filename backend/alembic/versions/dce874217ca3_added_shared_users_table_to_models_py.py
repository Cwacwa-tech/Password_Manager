"""Added Shared Users table to models.py

Revision ID: dce874217ca3
Revises: 48be096d839e
Create Date: 2025-02-06 14:14:38.058585

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'dce874217ca3'
down_revision: Union[str, None] = '48be096d839e'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('shared_users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('vault_entry_id', sa.Integer(), nullable=False),
    sa.Column('user_email', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['user_email'], ['users.email'], ),
    sa.ForeignKeyConstraint(['vault_entry_id'], ['vault_entries.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_shared_users_id'), 'shared_users', ['id'], unique=False)
    op.drop_index('ix_users_id', table_name='users')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_index('ix_users_id', 'users', ['id'], unique=False)
    op.drop_index(op.f('ix_shared_users_id'), table_name='shared_users')
    op.drop_table('shared_users')
    # ### end Alembic commands ###
