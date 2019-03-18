<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
<xsl:template match="/">
<HTML>
<HEAD>
<TITLE>Student</TITLE>
</HEAD>
<BODY>
<p>hi</p>
<xsl:for-each select="Teacher/Teacher">
    
    
<BR/>
</xsl:for-each>
</BODY>
</HTML>
</xsl:template>
</xsl:stylesheet>