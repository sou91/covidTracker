import React from 'react'
import {Card,CardContent,Typography} from '@material-ui/core'

function InfoBox({title, cases, total, cardClick, active, color}) {
    const styles = {
        borderTop: `10px solid ${color}` 
   };
    return (
        <Card className={`infoBox ${active && "infoBox--selected"}`} onClick={cardClick} style={active?styles:null}>
           <CardContent>
            <Typography className='infoBox__title' > 
                {title}
            </Typography>
            <h2 className='infoBox__cases' style={{color:color}}>{cases?cases:'N/A'}</h2>
            <Typography color="textSecondary" className='infoBox__total'>
                {total} Total
            </Typography>
           </CardContent> 
        </Card>
    )
}

export default InfoBox
