import * as React from 'react';
import { SphinxPage } from '../sphinx';
import { Sponsors, SponsorView } from './sponsors';

export interface LandingPageProps {
    data: SphinxPage;
    sponsors: Sponsors;
}

declare var $: any;

const dontGrowParent: React.CSSProperties = {
    minWidth: "100%",
    width: 0,
}

type Question = { question: string | JSX.Element, answer: string | JSX.Element };
const questions: Question[] = [
    {
        question: "Isn't this book free?",
        answer: "Yes, the HTML version is free. But the other electronic versions are not.",
    },
    {
        question: 'What do you mean by "pay what you can"?',
        answer: "It means that I want people to learn Modelica in an affordable way. If you are a college student, you can read the HTML version for free or spend $5 and get the electronic versions of the book, too. If you are a professional engineer, I think you should be willing to pay at least $20 for a book tied closely to your professional activities."
    },
    {
        question: "What happens if a newer version comes out?",
        answer: "Anyone who buys the electronic version of the book is entitled to free upgrades for life. Be sure to include your email address and you'll be added to the mailing list of people who receive new download links for subsequent version. So you don't have to worry about getting stuck with an old version.",
    },
    {
        question: "What kind of DRM is there on the electronic version?",
        answer: (
            <div>
                <em>None</em>. I hate DRM and I don't want to waste my time trying to prevent people from stealing the material. If you are that desperate that you need to steal it rather than pay $5 then go ahead. But I believe that most technical people are inherently honest and I trust them to pay what they think is appropriate. I hope they prove me right.
            </div>),
    },
    {
        question: "Wasn't this book already paid for via Kickstarter?",
        answer: "The Kickstarter project was a way to demonstrate demand for the book and avoid taking on a big financial risk. At the end of the day, the goal was a free HTML book on Modelica and that was successful. But I hope to keep the book up to date and add future chapters on advanced topics. Those activities go beyond the scope of the original Kickstarter project and by buying the book you not only provide financial compensation for the effort that was already made in creating the book but it encourages such future work as well.",
    },
    {
        question: "Is there a print version of book?",
        answer: (
            <div>
                <div>
                    At the moment, there is no print version of the book.  Our
	                goal is to incorporate all the feedback we receive on the
	                HTML version of the book before making a print version.  We
	                want to avoid situations where the print version becomes
	                obsolete compared to the electronic versions.
                    We do plan to produce a print version.  So, please subscribe
	                to our <a href="http://eepurl.com/PAEKj">mailing list</a> to
	                be informed when the print version becomes available.
	            </div>
            </div >
        )
    }
]

export class QuickLinks extends React.Component<{}, {}> {
    componentDidMount() {
        $('.ui.accordion').accordion();
    }
    render() {
        return (
            <div className="ui styled fluid accordion">
                <div className="title">
                    <i className="dropdown icon" />
                    Sign up for mailing list
                </div>
                <div className="content">
                    <div className="hidden transition">
                        <div id="mc_embed_signup" style={{ background: "transparent", clear: "left", font: "14px Helvetica,Arial,sans-serif" }}>
                            <p style={dontGrowParent}>Give us your email address and we'll keep you informed about the latest developments with the book...</p>
                            <form className="ui form validate" action="http://xogeny.us3.list-manage.com/subscribe/post?u=3bfc2e5430d32efbe641d6e58&amp;id=f260a85b89"
                                method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form"
                                target="_blank" noValidate={true} style={{ marginLeft: "20px" }}>
                                <div className="field">
                                    <label>E-mail</label>
                                    <input type="email" value="" name="EMAIL"
                                        className="email" id="mce-EMAIL" placeholder="email address" required={true} />
                                    <div style={{ position: "absolute", left: "-5000px" }}>
                                        <input type="text" name="b_3bfc2e5430d32efbe641d6e58_f260a85b89"
                                            value="" />
                                    </div>
                                </div>
                                <div className="clear">
                                    <input type="submit" value="Subscribe" name="subscribe"
                                        id="mc-embedded-subscribe" className="button ui submit" />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="title">
                    <i className="dropdown icon" />
                    Purchase eBook
                </div>
                <div className="content">
                    <div className="transition hidden">
                        <div className="pull-right">
                            <form action="https://www.paypal.com/cgi-bin/webscr"
                                method="post" target="_top">
                                <input type="hidden" name="cmd" defaultValue="_s-xclick" />
                                <input type="hidden" name="hosted_button_id" defaultValue="43ECRF7WVKHFN" />
                                <input type="hidden" name="return" defaultValue="/_static/thanks.html" />
                                <input type="image" name="submit" alt="PayPal - The safer, easier way to pay online!"
                                    src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif" />
                                <img width={1} height={1}
                                    src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" />
                            </form>
                        </div>
                        <p style={dontGrowParent}>
                            You can purchase both ePub and PDF versions of the book in
	                        either letter or A4 format.  Once you buy the book, you will be
	                        sent links to download the electronic versions.  As new versions
	                        of the book become available, you will be sent updated links
	                        to the latest electronic versions.
	                    </p>
                    </div>
                </div>
                <div className="title">
                    <i className="dropdown icon" />
                    FAQs
                </div>
                <div className="content">
                    <div className="transition hidden">
                        <div className="ui comments">
                            {questions.map((question, i) => (
                                <div key={i} style={dontGrowParent} className="comment">
                                    <span className="author">{question.question}</span>
                                    <div className="text">{question.answer}
                                    </div>
                                </div>))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export class LandingPage extends React.Component<LandingPageProps, {}> {
    render() {
        let data = this.props.data;
        return (
            <div>
                <div style={{ float: "right" }}>
                    <p>
                        <a href="http://book.xogeny.com/cn">中文版</a>
                        <br />
                        <a href="http://modelicabyexample.globalcrown.com.cn/">国内镜像</a>
                    </p>
                </div>
                <div className="ui fluid" style={{ textAlign: "center" }}>
                    <img src="/_static/images/TitleHeading.png" />
                    <h3 style={{ marginTop: 0, marginBottom: "10px" }} className="ui sub header">by Dr. Michael M. Tiller</h3>
                </div>

                <div className="ui divider" />

                <div style={{ display: "flex" }}>
                    <div id="column1" style={{ flexGrow: 1, marginRight: "20px" }}>
                        <div className="ui segment">
                            <h1>Table of Contents</h1>
                            <div dangerouslySetInnerHTML={{ __html: data.body }}>
                            </div>
                        </div>
                    </div>
                    <div id="column2">
                        <QuickLinks />
                        <SponsorView sponsors={this.props.sponsors} />
                    </div>
                </div>
            </div>
        )
    }
}