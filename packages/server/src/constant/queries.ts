const AUTH_QUERY = {
  FIND_REFRESH_TOKEN: `
    select a.refresh_token as refreshToken
    from Auth a
    where a.refresh_token = ?
  `,
  FIND_REFRESH_TOKEN_BY_USER_ID: `
  select a.refresh_token as refreshToken
  from Auth a 
  where a.user_id = ?
  `,
  UPDATE_REFRESH_TOKEN: (refreshToken: string | null) => `
    update Auth set refresh_token = "${refreshToken}"
    where user_id = ?
    `,
  INSERT_REFRESH_TOKEN: `
    insert into Auth (user_id, refresh_token) 
    values (?, ?)
    `,
};

const CATEGORY_QUERY = {
  GET_CATEGORIES: `select id, name, imgUrl from Category`,
  GET_CATEGORY_BY_NAME: `select id, name from Category where name = ?`,
  GET_CATEGORY_BY_ID: `select id, name from Category where id = ?`,
};

const LOCATION_QUERY = {
  FIND_LOCATION_BY_KEYWORD: `
    select id, sido, gungu, dong, code from Location l
    where l.sido like ? or l.gungu like ? or l.dong like ?
    limit ?, ?
    `,
  FIND_LOCATION_BY_CODE: `
    select id, sido, gungu, dong, code from Location l
    where l.code like ?
    limit ?, ?
    `,
  GET_LOCATION_BY_CODE: `
    select id, sido, gungu, dong, code from Location l
    where l.code = ?
    `,
  GET_LOCATION_BY_ID: `
    select id, sido, gungu, dong, code from Location l
    where l.id = ?
    `,
};

const PRODUCT_QUERY = {
  GET_PRODUCT_DETAIL_BY_ID: `
    select p.id as id, title, description, price, p.imgUrl as imgUrl, status, hits,
          json_object('id', l.id, 'code', l.code, 'dong', l.dong) as location,
          json_object('id', c.id, 'name', c.name) as category,
          json_object('id', u.id, 'userId', u.user_id, 'name', u.name) as seller,
          if(count(w.id) = 0, json_array(), json_arrayagg(w.user_id)) as likeUsers
    from Product p
    join location l on p.location_id = l.id
    join user u on u.id = p.seller_id
    join category c on c.name = p.category_name
    left join wish w on w.product_id = p.id
    where p.id = ?;
    `,
  INSERT_PRODUCT: `
    insert into Product (title, description, price, imgUrl, location_id, seller_id, category_name)
    values (?, ?, ?, ?, ?, ?, ?)
    `,
  UPDATE_PRODUCT: `
    update product
    set title = ?, description = ?, price = ?, imgUrl = ?, location_id = ?, seller_id = ?, category_name = ?
    where id = ?
    `,
  UPDATE_PRODUCT_STATUS: `
    update product
    set status = ?
    where id = ?
    `,
  DELETE_PRODUCT: `
    delete from product where id = ?
    `,
  FIND_PRODUCT_BY_CATEGORY: `
    select p.id as id, title, imgUrl, price, l.dong as locationName, category_name as categoryName, seller_id as sellerId,
      if (count(w.id) = 0, json_array(), json_arrayagg(w.user_id)) as likeUsers
    from Product p
    join location l on p.location_id = l.id
    left join wish w on w.product_id = p.id
    where p.category_name = ? and p.location_id = ?
    group by p.id
    limit ?, ?;
    `,
  FIND_PRODUCT_BY_LOCATION: `
    select p.id as id, title, imgUrl, price, l.dong as locationName, category_name as categoryName, seller_id as sellerId,
      if (count(w.id) = 0, json_array(), json_arrayagg(w.user_id)) as likeUsers
    from Product p
    join location l on p.location_id = l.id
    left join wish w on w.product_id = p.id
    where p.location_id = ?
    group by p.id
    limit ?, ?;
    `,
  FIND_PRODUCT_BY_SELLER_ID: `
    select p.id as id, title, imgUrl, price, l.dong as locationName, category_name as categoryName, seller_id as sellerId,
      if (count(w.id) = 0, json_array(), json_arrayagg(w.user_id)) as likeUsers
    from Product p
    join location l on p.location_id = l.id
    left join wish w on w.product_id = p.id
    where p.seller_id = ?
    group by p.id
    limit ?, ?;
    `,
  GET_PRODUCT_BY_ID: `select * from product where id = ?`,
};

const USER_QUERY = {
  INSERT_USER: `
    insert into User (user_id, name, password)
    values (?, ?, ?)
    `,
  GET_USER_BY_ID: `
    select u.id, u.user_id as userId, u.name as name,
          json_arrayagg(json_object('id', l.id, 'dong', l.dong, 'code', l.code, 'isActive', l.is_active)) as locations,
          (select if (count(w.id) = 0, json_array(), json_arrayagg(w.product_id))
          from wish w
          where w.user_id = u.id) as wishes
    from User u
    left join (select l.id as id, ul.user_id as user_id, l.code as code, l.dong as dong, ul.is_active as is_active
              from userlocation ul
              join location l on ul.location_id = l.id) as l on u.id = l.user_id
    where u.id = ?;
    `,
  GET_USER_BY_USER_ID: `
    select u.id, u.user_id as userId, u.name as name,
          json_arrayagg(json_object('id', l.id, 'dong', l.dong, 'code', l.code, 'isActive', l.is_active)) as locations,
          (select if (count(w.id) = 0, json_array(), json_arrayagg(w.product_id))
          from wish w
          where w.user_id = u.id) as wishes
    from User u
    left join (select l.id as id, ul.user_id as user_id, l.code as code, l.dong as dong, ul.is_active as is_active
              from userlocation ul
              join location l on ul.location_id = l.id) as l on u.id = l.user_id
    where u.user_id = ?;
    `,
  GET_USER_BY_GITHUB_EMAIL: `
    select u.id, u.user_id as userId, u.name as name,
          json_arrayagg(json_object('id', l.id, 'dong', l.dong, 'code', l.code)) as locations,
          if (count(w.id) = 0, json_array(), json_arrayagg(w.product_id)) as wishes
    from User u
    left join userlocation ul on u.id = ul.user_id
    left join wish w on w.user_id = u.id
    left join location l on l.id = ul.id
    where u.github_email = ?;
    `,
  UPDATE_USER: `
    update User set name = ?
    where id = ?
    `,
  GET_USER_WITH_HASH_PASSWORD: `
    select u.id, u.user_id as userId, u.name as name, u.password as password
    from User u
    where u.user_id = ?;
    `,
  GET_USER_BY_GITHUB_ID: `
    select u.id, u.user_id as userId, u.name as name
    from User u
    where json_extract(u.github, '$.id') = ?;
    `,
};

const USER_LOCATION_QUERY = {
  INSERT_U_L: `
    insert into userlocation (user_id, location_id, is_active)
    values (?, ?, ?);
    `,
  DELETE_U_L: `
    delete from userlocation
    where user_id = ? and location_id = ?;
    `,
  UPDATE_U_L: `
    update userlocation
    set is_active = true
    where user_id = ? and location_id = ?
    `,
  GET_COUNT_U_L: `
    select count(*) as count
    from userlocation
    where user_id = ?
    `,
  UPDATE_ALL_U_L_TO_FALSE: `
    update userlocation
    set is_active = false
    where user_id = ?
    `,
  UPDATE_ALL_U_L_TO_TRUE: `
    update userlocation
    set is_active = true
    where user_id = ?
    `,
  GET_U_L_BY_UID_LID: `
    select user_id as userId, location_id as locationId
    from userlocation
    where user_id = ? and location_id = ?;
    `,
};

const WISH_QUERY = {
  GET_WISH_BY_UID: `
    select p.id as id, title, imgUrl, price, l.dong as locationName, category_name as categoryName,
      seller_id as sellerId, json_arrayagg(w.user_id) as likeUsers
    from wish w
    left join product p on w.product_id = p.id
    left join location l on p.location_id = l.id
    where w.user_id = ?
    group by p.id
    limit ?, ?;
    `,
  INSERT_WISH: `
    insert into wish (user_id, product_id)
    values (?, ?)
    `,
  DELETE_WISH: `
    delete from wish where user_id = ? and product_id = ?
    `,
  GET_WISH_BY_UID_PID: `
    select user_id as userId, product_id as productId
    from wish
    where user_id = ? and product_id = ?
    `,
};

export {
  AUTH_QUERY,
  CATEGORY_QUERY,
  LOCATION_QUERY,
  PRODUCT_QUERY,
  USER_QUERY,
  USER_LOCATION_QUERY,
  WISH_QUERY,
};