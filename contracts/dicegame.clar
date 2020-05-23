(define-data-var target int 0)
(define-data-var isTargetSet bool false)
(define-data-var isBetSet bool false)
(define-data-var player1 int 0)
(define-data-var player2 int 0)
(define-data-var winner int 0)
(define-data-var amount uint u10)
(define-constant dicegame 'ST260DYV52QGC4P8MGB8PPM40VBXJ6PS8AE2AS9G0.dicegame)
(define-constant player1add 'ST3CTE94HNTJ8R0E3C4CY4RWJ94KTMC0K8815KAH6)
(define-constant player2add 'ST26FVX16539KKXZKJN098Q08HRX3XBAP541MFS0P)
(define-data-var winneradd principal 'ST3CTE94HNTJ8R0E3C4CY4RWJ94KTMC0K8815KAH6)

;;This method is to get Target value
;;Returns : int
(define-public (getTarget)
   (ok (var-get target)))


;;This method is to get Flag value for isTargetSet 
;;Returns : int
   (define-public (getFlag)
   (ok (var-get isTargetSet)))

;;This method is to set target
;;Here we are setting initial target value as 10.
(define-public (setTarget)
   (begin
     (var-set target (+ (var-get target) 10))
                (ok (var-get target))
       )
)

;;This method is used to setamount(STX unit) equivalent to target
;;Returns : Uint

(define-public (setamount)
   (begin
    (if (is-eq (var-get isTargetSet) true) 1 0)
    (begin
   (var-set amount (to-uint (var-get target)))
            (ok (var-get amount))
       )
   )
)


;;This method is used to getamount(STX unit)
;;Returns : Uint
(define-public (getamount)
   (ok (var-get amount)))

;;This method is to set Flag value as true for isTargetSet
;;First we will check if target is set.If target is set, then we will mark the flag as true.
;;Returns:Boolean
   (define-public (setFlag)
   (begin
   (if (not (is-eq (var-get target) 0)) 1 0)
   (begin
     (var-set isTargetSet true)
       (ok (var-get isTargetSet))
       )
   ))


;;This method is to set the Player1 Bet value 
;;Here we are setting the bet value as 10
;;Returns:int
(define-public (setBetplayer1)
    (begin
        (if (is-eq (var-get isTargetSet) true) 1 0)
        (begin
        (var-set player1 (+ (var-get player1) 10))
       ;; (ok (checkifIwon (player1))))
        (ok (var-get player1)))))

    
;;In this method we are getting Player 1 Bet amount
;;Returns :int
   (define-public (getBetPlayer1)
   (ok (var-get player1)))

  
;;This method is to set the Player2 Bet value 
;;Here we are getting the bet value as 20
;;Returns :int
(define-public (setBetplayer2)
    (begin
        (if (is-eq (var-get isTargetSet) true) 1 0)
        (begin
        (var-set player2 (+ (var-get player2) 20))
         (ok (var-get player2)))))

;;In this method we are getting the Player2 Bet amount 
;;Returns :int
  (define-public (getBetPlayer2)
   (ok (var-get player2)))

;;This method is used to get winner 
;;Condition is check if player1 , player2 and target value is the same 
;;If the player1, player2 and target value is not equal, first we will check player1 value and target value
;;IF both are same , then set winner value as player 1 value 
;;If player1 value and target value is not same, then check player2 and target value 
;;If player2 and target value is the same then set winner value as player2 
;;If all target, player1 , player2 values are equal , then say all won.
;;Returns :int

(define-public (selectwinner)
(if (not (is-eq (var-get player1) (var-get target) (var-get player2)))
(begin
(if (is-eq (var-get player1) (var-get target))
(begin
(var-set winner (var-get player1))
(var-set winneradd player1add)
(print "Player1 won")
(ok (var-get winner))

;;(ok true)
)
(begin
(print "Player1 did not win")
(if (is-eq (var-get player2) (var-get target))
(begin
(var-set winner (var-get player2))
(var-set winneradd player2add)
(print "Player2 won")
(ok (var-get winner))
)
(begin
(print "Nobody won")
(ok (var-get winner))
)
)
)))
(begin
(print "Both Player1 and Player 2 won")
(ok (var-get winner))
)
)
)

 ;;In this method we are getting the winner amount 
 ;;Returns :int
  (define-public (getwinner)
   (ok (var-get winner)))

;;This method is used to find if winner is selected
;;If winner value is not equal to 0,print "Winner is selected" 
;;Also transfer the units equivalent to target from contract to winner using methos payout-winner
;;If winner value is still 0, then say "This round is still open"
;;Returns :message

(define-public (isWinnerselected)
(if (not (is-eq (var-get winner) 0)) 
(begin

;;(payout-winner) method is commented currently and replica of this method announcewinner is created to test in mocknet
   ;; (ok (payout-winner))
(ok "Winner is selected")
)
(ok "This round is still open. Players can proceed to bet")
 )
)


;;Temporary method to check STX transfer in mocknet
(define-public (announcewinner)
(if (is-eq (var-get winner) 0)
(begin
    (ok (payout-winner1))
    (ok true)
)
(ok false)
)
)

;;This method is used to transfer STX from contract to the winner
;;Principal :contract
;;Receiver principal :winner
;;Amount :STX unit equivalent to target amount

(define-private (payout-winner)
  (unwrap-panic (as-contract (stx-transfer? (var-get amount) dicegame (var-get winneradd)
  ))))


;;Temporary method to test mocknet
(define-private (payout-winner1)
  (unwrap-panic (as-contract (stx-transfer? u10 dicegame player1add)
  )))