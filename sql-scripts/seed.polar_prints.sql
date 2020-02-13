BEGIN;

    INSERT INTO polar_prints
        (product_name,date_purchased,date_sold,purchase_price,sold_price)
    VALUES
        ('Yeezy Black non', '11/25/2019', '12/01/2020', '245', '365'),
        ('Yeezy Yechiel', '12/23/2019', '01/10/2020', '245', '360'),
        ('Rose Gold Clot', '01/20/2020', '02/02/2020', '275', '800'),
        ('Yeezy Cloud White', '10/20/2029', '11/12/2019', '245', '300');

    INSERT INTO polar_users
        (first_name,last_name,user_name, password)
    VALUES
        ('polar', 'chef', 'polarchef', '$2a$12$lHK6LVpc15/ZROZcKU00QeiD.RyYq5dVlV/9m4kKYbGibkRc5l4Ne');
    -- password



    COMMIT;