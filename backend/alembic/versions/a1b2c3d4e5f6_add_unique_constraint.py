"""add_unique_constraint

Revision ID: a1b2c3d4e5f6
Revises: 40267204c380
Create Date: 2026-02-07 22:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a1b2c3d4e5f6'
down_revision: Union[str, Sequence[str], None] = '40267204c380'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_unique_constraint('uq_rate_adjustment_room_date', 'rate_adjustments', ['room_type_id', 'effective_date'])


def downgrade() -> None:
    op.drop_constraint('uq_rate_adjustment_room_date', 'rate_adjustments', type_='unique')
