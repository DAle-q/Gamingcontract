(define-constant dicegame 'ST260DYV52QGC4P8MGB8PPM40VBXJ6PS8AE2AS9G0.dicegame)
(define-data-var target int 0)
(define-data-var isTargetSet bool false)
(define-data-var player1 int 0)
(define-data-var player2 int 0)
(define-data-var winner int 0)

(define-public (getTarget)
   (ok (var-get target)))

(define-public (setTarget)
   (begin
     (var-set target (+ (var-get target) 10))
       (ok (var-get target))
       )
)

(define-public (setFlag)
   (begin
   (if (not (is-eq (var-get target) 0)) 1 0)
   (begin
     (var-set isTargetSet true)
       (ok (var-get isTargetSet))
       )
   ))

 (define-public (setBetplayer1)
    (begin
        (if (is-eq (var-get isTargetSet) true) 1 0)
        (begin
        (var-set player1 (+ (var-get player1) 10))  
        (if (is-eq (var-get target) (var-get player1)) 
        (begin
    (ok "You won"))
        
        (ok "You did not win")))))

  

         (define-public (setBetplayer2)
    (begin
        (if (is-eq (var-get isTargetSet) true) 1 0)
        (begin
        (var-set player2 (+ (var-get player2) 20))  
     (if (is-eq (var-get target) (var-get player2)) 
        (begin
    (ok "You won"))
        
        (ok "You did not win")))))

  
(define-private (announcewinner) 
(begin
(var-set winner (var-get player1))
(print (var-get winner))))

(define-private (didnotwin) 
(begin
(print ( var-get player2))))
