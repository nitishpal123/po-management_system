from ..utils.calculate_total import calculate_total
from .. import models


def create_purchase_order(db, po_data):

    items_data = [item.dict() for item in po_data.items]

    total = calculate_total(items_data)

    new_po = models.PurchaseOrder(
        reference_no=po_data.reference_no,
        vendor_id=po_data.vendor_id,
        total_amount=total,
        status="CREATED"
    )

    db.add(new_po)
    db.commit()
    db.refresh(new_po)

    for item in items_data:

        po_item = models.PurchaseOrderItem(
            po_id=new_po.id,
            product_id=item["product_id"],
            quantity=item["quantity"],
            price=item["price"]
        )

        db.add(po_item)

    db.commit()

    return new_po