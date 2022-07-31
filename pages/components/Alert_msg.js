import React from 'react'

function Alert_msg(props) {
    const capitalize = (word)=>{
        const lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    return (
        <div style={{height: '50px'}}>
        {props.alertmsg && <div className={`alert alert-${props.alertmsg.type} alert-dismissible fade show`} role="alert">
           <strong>{capitalize(props.alertmsg.type)}</strong>: {props.alertmsg.msg} 
        </div>}
        </div>
    )
}

export default Alert_msg