import React, {Component, Fragment} from "react";
import IntlMessages from "../../../util/IntlMessages";

class Countdown extends Component {
    constructor(props) {
        super(props);
        this.countDownId = null;
        this.state = {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            expired: false
        };
    }

    componentDidMount() {
        this.countDownId = setInterval(this.timerInit, 1000);
    }

    componentWillUnmount() {
        if (this.countDownId) {
            clearInterval(this.countDownId);
        }
    }

    timerInit = () => {
        const {startDate} = this.props;
        const now = new Date().getTime();
        if (!startDate) {
            this.setState({expired: true});
            return;
        }
        const countDownStartDate = new Date(startDate).getTime();
        const distance = countDownStartDate - now;
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // For countdown is finished
        if (distance < 0) {
            clearInterval(this.countDownId);
            this.setState({
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
                expired: true
            });
            return;
        }
        this.setState({days, hours, minutes, seconds, expired: false});
    };

    render() {
        const {days, hours, minutes, seconds, expired} = this.state;
        if (expired) {
            return <Fragment>
                <img alt="" src="/assets/images/icons/clock.png" className="img-icon"/>
                &nbsp;
                {this.props.status === "Complete" &&
                    <span className="success"><IntlMessages id="nft.auction.completed"/></span>
                }
                {this.props.status !== "Complete" &&
                    <span className="danger"><IntlMessages id="nft.auction.expired"/></span>
                }
            </Fragment>;
        } else {
            if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
                return null;
            } else {
                return <Fragment>
                    <img alt="" src="/assets/images/icons/clock.png" className="img-icon"/>
                    &nbsp;
                    <span className="description"><IntlMessages id="nft.end.in"/></span>
                    &nbsp;
                    <span>{days}</span>
                    &nbsp;
                    <span className="description"><IntlMessages id="nft.days"/></span>
                    &nbsp;
                    <span>
                        {
                            String(hours).length === 1 ? ("0" + hours) : hours
                        }
                        :
                        {
                            String(minutes).length === 1 ? ("0" + minutes) : minutes
                        }
                        :
                        {
                            String(seconds).length === 1 ? ("0" + seconds) : seconds
                        }
                    </span>
                </Fragment>;
            }
        }
    }
}

export default Countdown;