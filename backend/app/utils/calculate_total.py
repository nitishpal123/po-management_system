def calculate_total(items):

    subtotal = 0

    for item in items:
        subtotal += item["price"] * item["quantity"]

    tax = subtotal * 0.05

    total = subtotal + tax

    return total