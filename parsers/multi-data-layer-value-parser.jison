/* Description: Grammar for parsing and executing computations for layers. */

/* lexical grammar */
%lex
%%

\s+                     /* skip whitespace */
[0-9]+("."[0-9]+)?\b    return 'NUMBER'
"*"                     return '*'
"/"                     return '/'
"-"                     return '-'
"+"                     return '+'
"^"                     return '^'
"%"                     return '%'
"("                     return '('
")"                     return ')'
"sectorValue"           return 'FUNC_SECTOR_VALUE'
[a-zA-Z_][a-zA-Z0-9_]*  return 'DATASET_NAME'
<<EOF>>                 return 'EOF'
.                       return 'INVALID'

/lex

/* operator associations and precedence */

%left '+' '-'
%left '*' '/', '%'
%left '^'
%left UMINUS

%start expressions

%% /* language grammar */

expressions
    : e EOF
        { typeof console !== 'undefined' ? console.log($1()) : print($1());
          return $1; }
    ;

e
    : e '+' e
        {$$ = function() { return $1()+$3(); } }
    | e '-' e
        {$$ = function() { return $1()-$3(); } }
    | e '*' e
        {$$ = function() { return $1()*$3(); } }
    | e '/' e
        {$$ = function() { return $1()/$3(); } }
    | e '^' e
        {$$ = function() { return Math.pow($1(), $3()); } }
    | e '%' e
        {$$ = function() { return $1()%$3(); } }
    | '-' e %prec UMINUS
        {$$ = function() { return -$2(); } }
    | FUNC_SECTOR_VALUE '(' DATASET_NAME ')'
        {$$ = function() { return yy.getSectorValue(yy.sectorId, $3); } }
    | NUMBER
        {$$ = function() { return Number(yytext); } }
    | '(' e ')'
        {$$ = $2;}
    ;
