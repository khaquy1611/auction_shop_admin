import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import IntlMessages from "../../util/IntlMessages";
import { NotificationManager } from "react-notifications";
import { customGetSupply, customGetBalance } from "../../apiContracts/listenUSD"
import "./styles.scss"
import { formatAmount } from "../../modules/Utils"

const ListenUSD = () => {
    const [loading, setLoading] = useState(false)
    const [totalSupply, setTotalSupply] = useState()
    const [balance, setBalance] = useState()
    const [totalTransfer, setTotalTransfer] = useState()

    useEffect(() => {
        loadData();
    }, [])

    const loadData = () => {
        setLoading(true)
        customGetSupply().then(res => {
            setTotalSupply(res)
            setLoading(false)
        }).catch(ex => {
            console.error("customGetSupply ", ex);
            NotificationManager.error(<IntlMessages id="failed" />, "")
            setLoading(false)
        })

        customGetBalance(process.env.REACT_APP_LISTEN_USD).then(res => {
            setBalance(res)
            setLoading(false)
        }).catch(ex => {
            console.error("customGetBalance ", ex);
            NotificationManager.error(<IntlMessages id="failed" />, "")
            setLoading(false)
        })
    }

    return (
        <div className="container">
            <Spin size="large" spinning={loading} className="loading" style={{ position: 'absolute', zIndex: 999, left: '50%', top: "50%" }}></Spin>
            <div className="cards-container flex">
                <div className="card card-supply">
                    <img className="background" width="100%" height="100%" src="assets/images/icons/bg_blue_card.svg" />
                    <div className="card-content">
                        <p className="title">{<IntlMessages id="listen.usd.total.supply" />}</p>
                        <p className="value">{totalSupply ? formatAmount(totalSupply) : 0}</p>
                        {/* <p className="desc">0,3 % this week</p> */}
                    </div>
                </div>
                <div className="card card-balance">
                    <img className="background" width="100%" height="100%" src="assets/images/icons/bg_yellow_card.svg" />
                    <div className="card-content">
                        <p className="title">{<IntlMessages id="listen.usd.balance" />}</p>
                        <p className="value">{balance ? formatAmount(balance) : 0}</p>
                        {/* <p className="desc">0,3 % this week</p> */}
                    </div>
                </div>
                <div className="card card-transfer">
                    <img className="background" width="100%" height="100%" src="assets/images/icons/bg_green_card.svg" />
                    <div className="card-content">
                        <p className="title">{<IntlMessages id="listen.usd.total.transfer" />}</p>
                        <p className="value">{totalTransfer ? formatAmount(totalTransfer) : 0}</p>
                        {/* <p className="desc">0,3 % this week</p> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListenUSD;