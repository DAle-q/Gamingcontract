(define-data-var target int 0)
(define-data-var isTargetSet bool false)
(define-data-var player1 int 0)
(define-data-var player2 int 0)

(define-public (setTarget)
   (begin
     (var-set target (+ (var-get target) 10))
       (ok (var-get target))
       )
)


 (define-public (setIsTargetSet)
   (begin
   (if (some? target)
   (begin
     (var-set isTargetSet true)
       (ok (var-get isTargetSet))
       )
   )))

 (define-public announcewinner (winner int 0))
(ok var-get (winner) )

(define-public (setBetplayer1)
    (begin
        (if (is-eq (var-get isTargetSet) true)
        (begin
        (var-set player1 (+ (var-get player1) 10))  
        (if (is-eq (var-get target) (var-get player1)) 1 0 )
    (ok (announcewinner (var-get player1)))  
        ))))

        (define-public (setBetplayer2)
            (begin
        (if (is-eq (var-get isTargetSet) true)
    (begin
        (var-set player2(+ (var-get player2) 20) )
        (if (is-eq (var-get target) (var-get player2)) 1 0 )
         (ok (announcewinner (var-get player2)))      
         )
         )))

 
 
