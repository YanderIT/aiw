发起付款接口：发起付款接口(必用接口)

SDK Demo下载
    

支付网关接口URL：
正式环境：https://api.xunhupay.com/payment/do.html 
备用平台：https://api.dpweixin.com/payment/do.html (设置为可配置的变量，以便接口变更时方便修改)
传参方式：Post
使用curl的post方式传参数，并直接获取json返回值，引导客户跳转到支付链接。

请求参数：
#	参数名	含义	类型	说明
1	version	API 版本号	string(24)	必填。目前为1.1
2	appid	APP ID	string(32)	必填。填写虎皮椒的APPID，不是小程序APPID
3	trade_order_id	商户订单号	string(32)	必填。请确保在当前网站内是唯一订单号，只能是数字、大小写字母_-*
4	total_fee	订单金额(元)	decimal(18,2)	必填。单位为人民币 元，没小数位不用强制保留2位小数
5	title	订单标题	string(128)	必填。商户订单标题（不能超过127个字符或者42个汉字，不能有表情符号和%）
6	time	当前时间戳	int(11)	必填。PHP示例：time()
7	notify_url	通知回调网址	string(128)	必填。用户支付成功后，我们服务器会主动发送一个post消息到这个网址(注意：当前接口内，SESSION内容无效，手机端不支持中文域名)
8	return_url	跳转网址	string(128)	可选。用户支付成功后，我们会让用户浏览器自动跳转到这个网址
9	callback_url	商品网址	string(128)	可选。用户取消支付后，我们可能引导用户跳转到这个网址上重新进行支付
10	plugins	名称	string(128)	可选。 用于识别对接程序或作者
11	attach	备注	text	可选。备注字段，可以传入一些备注数据，回调时原样返回
12	nonce_str	随机值	string(32)	必填。作用：1.避免服务器页面缓存，2.防止安全密钥被猜测出来
13	hash	签名	string(32)	必填。
请求返回：
#	参数名	含义	类型	说明
1	oderid	订单id	int	订单id(此处有个历史遗留错误，返回名称是openid，值是orderid，一般对接不需要这个参数)
2	url_qrcode	二维码地址(PC端使用)	string(156)	二维码有效期五分钟，PC端可将该参数展示出来进行扫码支付，不用再转二维码，需自己处理跳转
3	url	请求url(手机端专用，PC端已停用)	string(155)	只需跳转此参数即可，系统会自动判断是微信端还是手机端，自动返回return_url，不能先显示“url_qrcode”二维码，再跳转“url”链接
4	errcode	错误码	int	
5	errmsg	错误信息	string(8)	错误信息具体值
6	hash	签名	string(32)	数据签名，参考下面签名算法
HASH生成的步骤如下：
第一步，设所有发送或者接收到的数据为集合M，将集合M内非空参数值的参数按照参数名ASCII码从小到大排序（字典序），使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串stringA。
特别注意以下重要规则：
1.◆ 参数名ASCII码从小到大排序（字典序）；
2.◆ 如果参数的值为空不参与签名；
3.◆ 参数名区分大小写；
4.◆ 验证调用返回或微信主动通知签名时，传送的hash参数不参与签名，将生成的签名与该hash值作校验。
5.◆ 微信接口可能增加字段，验证签名时必须支持增加的扩展字段
第二步，在stringA最后拼接上APPSECRET(秘钥)得到stringSignTemp字符串，并对stringSignTemp进行MD5运算，得到hash值（32位小写）。
HASH生成示例（PHP）：
function generate_xh_hash(array $datas,$hashkey){
 					ksort($datas);
                    reset($datas);
                    $arg  = '';
                    foreach ($datas as $key=>$val){
                    	if($key=='hash'||is_null($val)||$val===''){continue;}
                   	    if($arg){$arg.='&';}
                        $arg.="$key=$val";
                    }

                    return md5($arg.$hashkey);
}
Json请求成功时返回示例：
{
            "openid":"2019081202",
    		"url":"https:\/\/api.xunhupay.com\/alipay\/pay\/index.html?id=20351731&nonce_str=3642452019&time=1522390464&appid=20146122002&hash=ef07fb856239c6066a8c84c21835e047",
    		"errcode":0,
    		"errmsg":"success!",
    		"hash":"3a91e22ee359c914b0788c6007377638"
}
Json请求失败时返回示例：
{
    		"errcode":500,
    		"errmsg":"invalid sign!",
    		"hash":"3a91e22ee359c914b0788c6007377638"
}
付款成功回调通知

用户付款成功后，我们会向您在发起付款接口传入的notify_url网址发送通知。您的服务器只要返回内容：success，就表示回调已收到。如果返回内容不是success，我们会再尝试回调6次。
传参方式：Post
参数内容：form表单类型
#	参数名	含义	类型	说明
1	trade_order_id	商户订单号	string(32)	支付时请求的商户订单号
2	total_fee	订单支付金额	decimal(18,2)	订单支付金额
3	transaction_id	交易号	string(32)	支付平台内部订单号
4	open_order_id	虎皮椒内部订单号	string(32)	虎皮椒内部订单号
5	order_title	订单标题	string(32)	订单标题
6	status	订单状态	string(2)	OD已支付，CD已退款，RD退款中，UD退款失败
7	plugins	插件ID	string(128)	当传入此参数时才会有返回
7	attach	备注	text	当传入此参数时才会有返回
8	appid	支付渠道ID	string(32)	
9	time	时间戳	string(16)	
10	nonce_str	随即字符串	string(16)	
11	hash	签名	string(32)	请参考支付时签名算法
付款成功自动跳转

用户付款成功后，我们会在先通过notify_url接口，通知您服务器付款成功，然后引导用户跳转到return_url网址。


查询回调接口：
发起订单查询接口(可选)
SDK Demo下载

跳转支付页接口URL：
正式平台：https://api.xunhupay.com/payment/query.html
备用平台：https://api.dpweixin.com/payment/query.html
其他平台：https://api.diypc.com.cn/payment/query.html(建议5-10秒请求一次，最长不超过10分钟)
传参方式：POST
说明：用curl的post方式传参数，并直接获取json返回值，引导客户跳转到支付链接。

请求参数：
#	参数名	含义	类型	说明
1	appid	APP ID	string(32)	必填。应用ID
5	out_trade_order	商户网站订单号	string(32)	out_trade_order，open_order_id 二选一。请确保在您的网站内是唯一订单号
6	open_order_id	虎皮椒内部订单号	string(32)	out_trade_order，open_order_id 二选一。在支付时，或支付成功时会返回此数据给商户网站y
9	time	当前时间戳	int(11)	必填。PHP示例：time()
13	nonce_str	随机值	string(32)	必填。作用：1.避免服务器页面缓存，2.防止安全密钥被猜测出来
14	hash	签名	string(32)	必填。
HASH生成的步骤如下：
第一步，设所有发送或者接收到的数据为集合M，将集合M内非空参数值的参数按照参数名ASCII码从小到大排序（字典序），使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串stringA。

特别注意以下重要规则：

◆ 参数名ASCII码从小到大排序（字典序）；
◆ 如果参数的值为空不参与签名；
◆ 参数名区分大小写；
◆ 验证调用返回或微信主动通知签名时，传送的sign参数不参与签名，将生成的签名与该sign值作校验。
◆ 微信接口可能增加字段，验证签名时必须支持增加的扩展字段
第二步，在stringA最后拼接上APPSECRET得到stringSignTemp字符串，并对stringSignTemp进行MD5运算，得到hash值。

HASH生成示例（PHP）：
function generate_xh_hash(array $datas,$hashkey){
                    ksort($datas);
                    reset($datas);

                    $pre =array();
                    foreach ($datas as $key => $data){
                        if(is_null($data)||$data===''){continue;}

                        if($key=='hash'){
                            continue;
                        }

						//stripslashes 去除php POST请求自带的多余斜杠(其他语言可以不处理)
                        $pre[$key]=stripslashes($data);
                    }

                    $arg  = '';
                    $qty = count($pre);
                    $index=0;

                    foreach ($pre as $key=>$val){
                        $arg.="$key=$val";
                        if($index++<($qty-1)){
                            $arg.="&";
                        }
                    }

                    return md5($arg.$hashkey);
                }
Json请求成功时返回示例：
data.status ：OD(支付成功)，WP(待支付),CD(已取消)

{
    		"errcode":0,
            "data":{
            	"status":"OD",
                "open_order_id":"xxxx"
                ...
            },
    		"errmsg":"success!",
    		"hash":"3a91e22ee359c914b0788c6007377638"
    		}
Json请求失败时返回示例：
{
    		"errcode":500,
    		"errmsg":"invalid sign!",
    		"hash":"3a91e22ee359c914b0788c6007377638"
    		}