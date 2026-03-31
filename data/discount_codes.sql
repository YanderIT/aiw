-- 折扣码表
CREATE TABLE discount_codes (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount', 'bonus_credits'
    value DECIMAL(10,2) NOT NULL, -- 折扣值（百分比、固定金额或赠送积分数）
    min_amount INT, -- 最小订单金额（分）
    max_uses INT, -- 最大使用次数，NULL为无限制
    used_count INT NOT NULL DEFAULT 0, -- 已使用次数
    valid_from timestamptz NOT NULL,
    valid_until timestamptz NOT NULL,
    product_ids TEXT, -- 适用的产品ID列表，JSON格式，NULL为全部产品
    user_limit INT DEFAULT 1, -- 每用户使用限制，NULL为无限制
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW()
);

-- 折扣码使用记录表
CREATE TABLE discount_code_usage (
    id SERIAL PRIMARY KEY,
    discount_code_id INT NOT NULL REFERENCES discount_codes(id),
    user_uuid VARCHAR(255) NOT NULL,
    order_no VARCHAR(255) NOT NULL,
    discount_amount INT NOT NULL, -- 折扣金额（分）
    bonus_credits INT DEFAULT 0, -- 赠送积分数
    used_at timestamptz NOT NULL DEFAULT NOW()
);

-- 添加索引
CREATE INDEX idx_discount_codes_code ON discount_codes(code);
CREATE INDEX idx_discount_codes_active ON discount_codes(is_active);
CREATE INDEX idx_discount_code_usage_user ON discount_code_usage(user_uuid);
CREATE INDEX idx_discount_code_usage_order ON discount_code_usage(order_no);

-- 示例折扣码数据（针对新表格套餐）
INSERT INTO discount_codes (code, name, description, type, value, valid_from, valid_until, user_limit, product_ids, min_amount) VALUES
-- 新人专享包折扣码
('NEWCOMER39', '新人专享包特价', '新人专享包限时特价，立享39元超值价格', 'fixed_amount', 27.00, NOW(), NOW() + INTERVAL '3 months', 1, '["newcomer-package"]', 6600),
('WELCOME15', '新用户15%折扣', '新用户首次购买享受15%折扣', 'percentage', 15.00, NOW(), NOW() + INTERVAL '6 months', 1, NULL, NULL),

-- 单校直通套装折扣码
('SINGLESCHOOL30', '单校套装立减30元', '单校直通套装专享30元优惠', 'fixed_amount', 30.00, NOW(), NOW() + INTERVAL '2 months', NULL, '["single-school-package"]', 19900),
('SCHOOL20OFF', '单校申请8折优惠', '单校申请套装限时8折', 'percentage', 20.00, NOW(), NOW() + INTERVAL '1 month', 100, '["single-school-package"]', NULL),

-- 多校申请包折扣码
('MULTIAPP50', '多校申请立减50元', '多校申请包专享50元大额折扣', 'fixed_amount', 50.00, NOW(), NOW() + INTERVAL '3 months', 50, '["multi-school-package"]', 39900),
('HOTDEAL10', '热门套餐额外9折', '热门多校申请包额外10%优惠', 'percentage', 10.00, NOW(), NOW() + INTERVAL '2 months', NULL, '["multi-school-package"]', NULL),

-- 灵活通用包折扣码
('FLEXIBLE100', '灵活套餐立减100元', '灵活通用包大额优惠立减100元', 'fixed_amount', 100.00, NOW(), NOW() + INTERVAL '2 months', 20, '["flexible-package-10"]', 41900),
('FLEX15', '灵活套餐85折优惠', '灵活通用包限时85折', 'percentage', 15.00, NOW(), NOW() + INTERVAL '1 month', NULL, '["flexible-package-10"]', NULL),

-- 全能组合包折扣码
('ALLINONE150', '全能套餐立减150元', '全能组合包超值优惠立减150元', 'fixed_amount', 150.00, NOW(), NOW() + INTERVAL '2 months', 10, '["all-in-one-package-20"]', 81900),
('ULTIMATE20', '全能套餐8折特惠', '全能组合包限时8折特价', 'percentage', 20.00, NOW(), NOW() + INTERVAL '1 month', NULL, '["all-in-one-package-20"]', NULL),

-- 通用折扣码
('SPRING2024', '春季限时优惠', '春季活动全场9折优惠', 'percentage', 10.00, NOW(), NOW() + INTERVAL '1 month', NULL, NULL, NULL),
('SAVE88', '立减88元优惠券', '满300元立减88元', 'fixed_amount', 88.00, NOW(), NOW() + INTERVAL '2 months', NULL, NULL, 30000),
('BONUS5', '赠送5次生成机会', '购买任意套餐额外赠送5次生成', 'bonus_credits', 5.00, NOW(), NOW() + INTERVAL '3 months', 1, NULL, NULL),

-- VIP专享折扣码
('VIP25OFF', 'VIP专享75折', 'VIP用户专享25%折扣', 'percentage', 25.00, NOW(), NOW() + INTERVAL '6 months', 1, NULL, NULL),
('LOYALTY200', '忠诚用户立减200元', '老用户回馈立减200元', 'fixed_amount', 200.00, NOW(), NOW() + INTERVAL '1 month', 1, NULL, 50000);