<?php

shell_exec('../CASE/.venv/bin/python3 ../CASE/deploy.py');

http_response_code(200);

?>
